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

module.exports = {
    getAllOrders,
    userOrders,
    getOrderById 
}