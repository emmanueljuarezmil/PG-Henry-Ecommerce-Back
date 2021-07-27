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
                include: {
                    model: User,
                    attributes: {
                        exclude: [...exclude, 'hashedPassword']
                    }
                },
            } : 
            {
                include: {
                    model: User,
                    attributes: {
                        exclude: [...exclude, 'hashedPassword']
                    }
                },
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
    const { id = false } = req.params
    if(!id || id === 'undefined' ) return next('Se requiere el id de una orden')
    try {
        const orderToSend = await Order.findOne({
            where: {
                id
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
        if(!orderToSend) return res.send('No existe una orden con el Id indicado')
        
        const prodtosend = orderToSend.Products
        const promises = prodtosend.map(async (element, index) => {
            const {quantity} = await Order_Line.findOne({
                where: {
                    productID: element.id
                }
            })
            await prodtosend[index].setDataValue('quantity', quantity)
            return element
        })
        const prodToSendWithQuantity = await Promise.all(promises).then(result => result).catch(err => console.error(err))
        const user = await User.findOne({
            where: {
                id: orderToSend.UserId
            },
            attributes: ['name', 'userName', 'email', 'admin']
        })
        return res.send({
            products: prodToSendWithQuantity,
            orderId: id,
            User: user
        })
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
                UserId,
                status: 'cart'
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
                if(item && product.quantity > 0) {                   
                    item.quantity = product.quantity
                    await item.save()
                }
                else if(item && product.quantity === 0) {                   
                    await item.destroy()
                }
                else if (!item && product.quantity > 0) {  
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
        const prodtosend = orderToSend.Products
        const promises = prodtosend.map(async (element, index) => {
            const {quantity} = await Order_Line.findOne({
                where: {
                    productID: element.id
                }
            })
            await prodtosend[index].setDataValue('quantity', quantity)
            return element
        })
        const prodToSendWithQuantity = await Promise.all(promises).then(result => result).catch(err => console.error(err))
        return res.send({
            products: prodToSendWithQuantity,
            orderId: order.id
        })
    } catch (err) {
        next(err)
    }
};


const updateOrderStatus = async (req, res, next) => {
    const {UserId} = req.params;
    const {status} = req.body;
    if (!UserId) return res.status(400).send('El id del usuario es requerido')
    if (!status) return res.status(400).send('El status a actualizar es requerido');
    if(!['approved', 'cancelled','pending'].includes(status)) return res.status(400).send('El status a actualizar es invalido');

    try {
        const orderToUpdate = await Order.findOne({
            where: {
                UserId
            }
        })
        if (!orderToUpdate) return res.status(400).send('El id de la orden enviada es inválido');
        if(orderToUpdate.status === 'cart') {
            orderToUpdate.status = status
            await orderToUpdate.save()
        }
        if(status === 'approved') {
            orderToUpdate.shippingStatus === 'approved'
            await orderToUpdate.save()
        }
    } catch (err) {
        next(error)
        /* return res.status(400).send(err) */
    }





}

const updateShipStatus = async (req, res, next) => {
    const {id} = req.body;
    const {status} = req.body;    
    if (!id) return res.status(400).send('El id de la orden es requerida')
    if (!status) return res.status(400).send('El status a actualizar es requerido');
    if(!['uninitiated', 'processing','approved', 'cancelled'].includes(status)) return res.status(400).send('El status a actualizar es invalido');

    try {
        const orderToUpdate = await Order.findOne({
            where: {
                id
            }
        })
        if (!orderToUpdate) return res.status(400).send('El id de la orden enviada es inválido');        
        orderToUpdate.shippingStatus = status
        await orderToUpdate.save()  
        
    } catch (err) {
        next(error)
        /* return res.status(400).send(err) */
    }
}

module.exports = {
    getAllOrders,
    userOrders,
    getOrderById,
    updateOrder,
    updateOrderStatus,
    updateShipStatus
}