const { User, Product, Order, Order_Line } = require('../../db.js');

const exclude = ['createdAt', 'updatedAt']

const addCartItem = async (req, res, next) => {
    const {idUser} = req.params
    const{id, quantity} = req.body
    if (!idUser) return next({message:"el ID no es correcto"})
    if (!quantity) return next({message:"la cantidad es requerida"})
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return next({message:"Producto no encontrado"})
        };
        const quantityStock = Number(quantity);
        if (product.stock < quantityStock) {
            return next({mesaage: "No hay stock suficiente"})
        };
        const price = product.price 
        const user = await User.findOne({
            where: {
                id: idUser
            }
        });
        if (!user) {
            return next({message: "usuario no encontrado"})
        };
                let order = await Order.findOne({ where: { UserId: idUser, status: 'cart' } });
        if (!order) {
            order = await Order.create()
            await user.addOrder(order);
        };
                const createdProduct = await product.addOrder(order, { through: { orderId: order.id, quantity, price } })
                return res.send(createdProduct);
    } catch (err) {
        console.log(err)
        next(err)
    }
};

const getCartEmpty = async (req, res, next) => {
    const { idUser } = req.params   
    try {
        const orderUser = await Order.findAll({
            where: {
                UserId: idUser
            }
        })
        if(orderUser.length < 1) return next({message: "el ID es incorrecto"})
        const cart = await Order.destroy({
            where: {
                UserId: idUser
            },
        })
        return res.send('Todos los productos fueron removidos de tu carrito de compras')
    } catch (error) {
        next(error);
    }
};

const getAllCartItems = async (req, res, next, idUser = null) => {
    // console.log('Pre try')
    try {
        if (!req.params.idUser && !idUser) return next({message: "el ID de usuario es requerido"})
        // console.log(req.params, 'req.params')
        // console.log(idUser, 'idUser')
        const order = await Order.findOne({
            where: {
                UserId: req.params.idUser || idUser,
                status: 'cart'
            },
            attributes: {
                exclude
            }
        })
        console.log(order, 'order')
        const raw_cart = await Product.findAll({
            include: { model: Order, where: { id: order.id } },
            order: ['name']
        })
        // console.log(req.params, 'req.params')
        if (!raw_cart.length) {
            // return next({ message: "Aún no tienes productos en tu carrito de compras" })
            return res.send([])
        }

        let cart = []

        raw_cart.map(i => {
            let prod = {};

            prod.id = i.id
            prod.name = i.name
            prod.description = i.description
            prod.price = i.price
            prod.photo = i.photo
            prod.stock = i.stock
            prod.selled = i.selled
            prod.perc_desc = i.perc_desc
            i.Orders.map(j => {
                prod.quantity = j.Order_Line.quantity
            })
            cart.push(prod)
        })
        return res.status(200).json(cart)
    } catch (error) {
        next(error);
    }
};

const editCartQuantity = async (req, res, next) => {

    if (!req.params.idUser) return next({message: " El ID de usuario es requerido "})
    try {
        const user = await User.findByPk(req.params.idUser);
        if (!user) {
            return res.status(400).send("Usuario no encontrado")
        };
        const product = await Product.findByPk(req.body.id);
        const quantity = req.body.quantity;
        const price = product.price;
        let order = await Order.findOne({ where: { UserId: req.params.idUser, status: 'cart' } });
        const updatedQuantity = await product.addOrder(order, { through: { orderID: order.id, quantity, price } })
        return getAllCartItems(req, res, next, req.params.idUser);
    } catch (error) {
        next(error)
    }
};

const deleteCartItem = async (req, res, next) => {
    if (!req.params.idUser) return next({message: " El ID de la orden y del producto son requeridos "})
    try {
        const orderId = await Order.findOne({ where: { UserId: req.params.idUser } });
        if (!orderId) {
            res.status(400).send("Usuario no encontrado")
        };
        let order = await Order_Line.findOne({ where: { orderID: orderId.dataValues.id, productID: req.params.idProduct } });
        if(!order) return next({message: " El ID de la orden y del producto son invalidos "});
        await Order_Line.destroy({ where: { productID: order.dataValues.productID, orderID: orderId.dataValues.id } })
        return getAllCartItems(req, res, next, req.params.idUser);
    } catch (error) {
        next(error)
    }
};

module.exports = {
    addCartItem,
    getCartEmpty,
    getAllCartItems,
    editCartQuantity,
    deleteCartItem
}