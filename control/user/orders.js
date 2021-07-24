const { User, Product, Order, Order_Line } = require('../../db.js');
const { Op } = require('sequelize')

const exclude = ['createdAt', 'updatedAt']

const getAllOrders = async (req, res, next) => {
    const {status} = req.query
    try {
        const orderByStatus = await Order.findAll(
            status ?
                {
                    where: {
                        status
                    },
                    attributes: {
                        exclude
                    }
                } :
                {
                    attributes: {
                        exclude
                    }
                }
        )
        return res.send(orderByStatus)
    } catch (error) {
        next(error);
    }
};

const userOrders = async (req, res, next) => {
    const {idUser} = req.params
    try {
        const userOrders = await Order.findAll({
            where: {
                UserId: idUser,
                status: 'cart'
            }
        })
        if (!userOrders.length) {
            return res.status(201).send('El usuario requerido no tiene ninguna orden')
        }
        return res.send(userOrders)
    } catch (error) {
        next(error);
    }
};

const getOrderById = async (req, res, next) => {
    const { id } = req.params
    try {
        const order = await Order.findAll({
            where: {
                id
            },
            attributes: {
                exclude
            },
            include: {
                model: Product,
                attributes: {
                    exclude
                },
                through: {
                    model: Order_Line,
                    attributes: []
                }
            }
        })
        return res.send(order)
    } catch (err) {
        next(err)
    }
};

const updateOrder = async (req, res, next) => {
    const { UserId } = req.params
    const products = req.body
    if (!UserId) return res.status(400).send('El id del usuario es requerido')
    try {
        const [order, created] = await Order.findOrCreate({
            where: {
                UserId
            }
        })
        if(products && products.length) {         
            for(let product of products) {
                const item = await Order_Line.findOne({
                    where: {
                        orderID: order.id,
                        productID: product.id,
                    }
                })
                if(item) {
                    
                    item.quantity = product.quantity
                    await item.save()
                }
                else {  
                    await Order_Line.create({
                            orderID: order.id,
                            productID: product.id,
                            quantity: product.quantity,
                            price: product.price
                    })
                }
            }
        }
        const orderToSend = await Order.findOne({
            where: {
                id: order.id
            },
            include: {
                model: Product,
                attributes: {
                    exclude
                },
                through: {
                    attributes: []
                }
            },
            attributes: {
                exclude
            }
        })
        return res.send(orderToSend)
    } catch (err) {
        next(err)
    }
};

module.exports = {
    getAllOrders,
    userOrders,
    getOrderById,
    updateOrder
}