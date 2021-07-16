const { User, Product, Order, Order_Line } = require('../../db.js');

const exclude = ['createdAt', 'updatedAt']

const getAllOrders = async (req, res, next) => {
    if (!req.query.status) return res.status(400).send("Status is required ")
     try {
         const orderByStatus = await Order.findAll({
             where: {
                 status: req.query.status                
             }          
         })
         if (!orderByStatus.length) {
             return res.status(400).json({ message: 'There are not orders with that status.' })
         }
         return res.status(200).json(orderByStatus)
     } catch (error) {
         next(error);
     }
 };

 const userOrders = async (req, res, next) => {
    if (!req.params.idUser) return res.status(400).send("Correct idUser is required ")
    try {
        const userOrders = await Order.findAll({
            where: {
                UserId: req.params.idUser,
                status: 'cart'              
            }          
        })
        if (!userOrders.length) {
            return res.status(400).json({ message: 'The user has not any order' })
        }
        
        return res.status(200).json(userOrders)
    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    const {id} = req.params
    if (!id) return res.status(400).send("Order ID is required")
    try {
        // const order = await Order.findByPk(id)
        const order = await Order_Line.findAll({
            where: {
                orderID: id
            }
        })
        return res.send(order)
    }catch(err) {
        return res.status(400).send(err)
    }
};

const updateOrder = async (req, res, next) => {
    const {id} = req.params
    const {products} = req.body
    console.log('IDuser', id)
    console.log('Products', products)
    if(!id) return res.status(400).send('El id de la orden es requerido')
    if(!products) return res.status(400).send('Los productos a eliminar son requeridos')
    try {
        const orderToDelete = await Order.findByPk(id)
        if(!orderToDelete) return res.status(400).send('El id de la orden enviada es inválido')
        const UserId = orderToDelete.UserId
        const user = await User.findOne({
            where: {
                id: UserId
            }
        });
        if(!user) return res.status(400).send('El usuario es inválido')
        const verifiedProductsPromises = products.map(async productToAdd => {            
            try {
                const product = await Product.findByPk(productToAdd.id);
                if (!product) {
                    return 'El id de alguno de los productos enviados es inválido'
                    // changeError('Alguno de los productos enviados es inválido')
                };
                const quantity = productToAdd.quantity;
                if (product.stock < quantity) {
                    return 'No hay stock suficiente de alguno de los productos'
                    // changeError('No hay stock suficiente de alguno de los productos')
                }
            } catch(err){
                console.error(err)
                return err    
            }
        })
        const error = await Promise.all(verifiedProductsPromises).then(result => result).catch(err => err)
        console.log('paso del primer try catch')
        console.log('Error: ', error)
        const concatError = error.filter(element => element)
        if(concatError[0]) return res.status(400).send(concatError)
        orderToDelete.destroy()
        const order = await Order.create()
        user.addOrder(order);
        await products.forEach(async productToAdd => {            
            try {
                const product = await Product.findByPk(productToAdd.id);
                const quantity = Number(productToAdd.quantity);
                const price = product.price
                await product.addOrder(order, { through: { orderId: order.id, quantity, price } })
            } catch(err){
                console.error(err)    
            }
        })
        return res.send(order)
    }catch(err) {
        return res.status(400).send(err)
    }
};
 
 module.exports = {
     getAllOrders,
     userOrders,
     getOrderById,
     updateOrder    
 }