const { User, Product, Order, Order_Line } = require('../../db.js');
const usersDBJson = require('../../bin/data/users.json')
const { Op } = require('sequelize')

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
        let orderItem = await Order_Line.findOne({
            where: {
                orderID: order.id,
                productID: id,
            }
        })
        if(!orderItem) {
            orderItem = await Order_Line.create({
                orderID: order.id,
                productID: id,
                quantity,
                price: product.price
            })
        }
        else {
            orderItem.quantity+=quantity
            await orderItem.save()
        }
        const productsOrderLines = await Order_Line.findAll({
            where: {
                orderID: order.id
            }
        })
        const productsIds = productsOrderLines.map(order => {
            return {
                id: order.productID
            }
        })
        const productsToSend = await Product.findAll({
            where: {
                [Op.or]: productsIds
            },
            attributes: {
                exclude
            }
        })
        const addQuantity = productsToSend.map(async product => {
            const index = productsOrderLines.findIndex(productOrderLine => productOrderLine.productID === product.id)
            await product.setDataValue('quantity', productsOrderLines[index].quantity)
        })
        await Promise.all(addQuantity).then(() => {return}).catch(err => console.error(err))
        return res.send(productsToSend);
    } catch (err) {
        console.error(err)
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
    try {
        if (!req.params.idUser) return next({message: "el ID de usuario es requerido"})
        let order = await Order.findOne({
            where: {
                UserId: req.params.idUser,
                status: 'cart'
            },
            attributes: {
                exclude
            }
        })
        if(!order) {
            order = await Order.create({
                UserId: req.params.idUser,
            })
        }
        const raw_cart = await Product.findAll({
            include: { model: Order, where: { id: order.id } },
            order: ['name']
        })
        if (!raw_cart.length) {
            return res.status(200).send({
                products: [],
                orderId: order.id
            })
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
        return res.status(200).send({
            products: cart,
            orderId: order.id
        })
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
        next();
    } catch (error) {
        next(error)
    }
};

const deleteCartItem = async (req, res, next) => {
    const { idUser, idProduct } = req.params;
    if (!req.params.idUser) return res.json({message: " El ID de la orden y del producto son requeridos "})
    try {
        const orderId = await Order.findOne({ where: { UserId: idUser, status: 'cart' } });
        if (!orderId) {
            return res.status(400).send("Orden no encontrado")
        };
        let order = await Order_Line.findOne({ where: { orderID: orderId.dataValues.id, productID: idProduct } });
        if(!order) return next({message: " El ID de la orden y del producto son invalidos "});
        await Order_Line.destroy({ where: { productID: order.dataValues.productID, orderID: orderId.dataValues.id } })
        return res.json({ message: "Item borrado" });
    } catch (error) {
        next(error);
    }
};

async function fullDbOrders() {
    try {
        const products = await Product.findAll()
        const users = await User.findAll()
        let productIndex = 0
        for (let user of users) {
            const order = await Order.create()
            await user.addOrder(order);
            for(let i = 0; i < 7; i++) {
                await Order_Line.create({
                    orderID: order.id,
                    productID: products[productIndex].dataValues.id,
                    quantity: 1,
                    price: products[productIndex++].dataValues.price
                })
            }
        }
    } catch(err) {
        console.error(err)
    }
}

module.exports = {
    addCartItem,
    getCartEmpty,
    getAllCartItems,
    editCartQuantity,
    deleteCartItem,
    fullDbOrders
}
