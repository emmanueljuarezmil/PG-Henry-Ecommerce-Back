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
            next({message: "usuario no encontrado"})
        };
        let order = await Order.findOne({ where: { UserId: idUser, status: 'cart' } });
        if (!order) {
            order = await Order.create()
            user.addOrder(order);
        };
        const createdProduct = await product.addOrder(order, { through: { orderId: order.id, quantity, price } })
        return res.send(createdProduct);
    } catch (err) {
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

const getAllCartItems = async (req, res, next) => {
    const { idUser } = req.params
    if (!idUser) return next({message: "el ID de usuario es requerido"})
    try {
        const orderUser = await Order.findAll({
            where: {
                UserId: idUser
            }
        })
        if(orderUser.length < 0) return next({message: "No existen órdenes asociadas con ese ID"})
        const order = await Order.findOne({
            where: {
                UserId: idUser,
                status: 'cart'
            },
            attributes: {
                exclude
            }
        })
        if(Object.keys(order).length === 0) return next({message: "No existen órdenes asociadas con ese usuario"})
        const cart = await Order_Line.findAll({
            where: {
                orderID: order.id
            },
            attributes: {
                exclude
            }
        })
        if (!cart.length) {
            return next({ message: "Aún no tienes productos en tu carrito de compras" })
        }
        return res.status(200).json(cart)
    } catch (error) {
        next(error);
    }
};

const editCartQuantity = async (req, res, next) => {
    const { idUser } = req.params
    const{ id, quantity } = req.body
    if (!idUser) return next({message: " El ID de usuario es requerido "})
    try {
        const product = await Product.findByPk(id);
        const quantityCart = quantity;
        const price = product.price;
        const user = await User.findByPk(idUser);
        let order = await Order.findOne({ where: { UserId: idUser, status: 'cart' } });
        if (!user) {
            res.status(400).send("No se encontró el usuario")
        };
        const updatedQuantity = await product.addOrder(order, { through: { orderID: order.id, quantityCart, price } })
        return res.send(updatedQuantity);

    } catch (error) {
        next(error)
    }
};

const deleteCartItem = async (req, res, next) => {
    const { orderID, productID } = req.body
    if (!orderID && !productID) return next({message: " El ID de la orden y del producto son requeridos "})
    try {
        const order = await Order_Line.findOne({
            where:{
                productID, orderID
            }
        })
        if(!order) return next({message: " El ID de la orden y del producto son invalidos "});
        await order.destroy()
        return res.send("el producto fue eliminado de la orden")
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