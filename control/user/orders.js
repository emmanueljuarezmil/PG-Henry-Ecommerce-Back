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

// const updateOrder = async (req, res, next) => {
//     const { id } = req.params
//     const { products } = req.body
//     if (!id) return res.status(400).send('El id de la orden es requerido')
//     if (!products) return res.status(400).send('Los productos a actualizar son requeridos')
//     try {
//         const orderToDelete = await Order.findByPk(id)
//         if (!orderToDelete) return res.status(400).send('El id de la orden enviada es inválido')
//         const UserId = orderToDelete.UserId
//         const user = await User.findByPk(UserId);
//         if (!user) return res.status(400).send('El usuario es inválido')
//         const verifiedProductsPromises = products.map(async productToAdd => {
//             try {
//                 const product = await Product.findByPk(productToAdd.id);
//                 if (!product) {
//                     return 'El id de alguno de los productos enviados es inválido'
//                 };
//                 if (product.stock < productToAdd.quantity) {
//                     return 'No hay stock suficiente de alguno de los productos'
//                 }
//             } catch (err) {
//                 console.error(err)
//                 return err
//             }
//         })
//         const error = await Promise.all(verifiedProductsPromises).then(result => result).catch(err => err)
//         const concatError = [...new Set(error.filter(element => element))].join('. ')
//         if (concatError) return res.status(400).send(concatError)
//         await orderToDelete.destroy()
//         const order = await Order.create()
//         await user.addOrder(order);
//         await products.forEach(async productToAdd => {
//             try {
//                 const product = await Product.findByPk(productToAdd.id);
//                 const quantity = Number(productToAdd.quantity);
//                 const price = product.price
//                 await product.addOrder(order, { through: { orderId: order.id, quantity, price } })
//             } catch (err) {
//                 console.error(err)
//             }
//         })
//         return res.send('La orden fue actualizada con éxito')
//     } catch (err) {
//         return res.status(400).send(err)
//     }
// };

const updateOrder = async (req, res, next) => {
    const { id } = req.params
    const { products } = req.body
    if (!id) return res.status(400).send('El id de la orden es requerido')
    if (!products) return res.status(400).send('Los productos a actualizar son requeridos')
    try {
        const orderToDelete = await Order.findByPk(id)
        if (!orderToDelete) return res.status(400).send('El id de la orden enviada es inválido')
        const UserId = orderToDelete.UserId
        const user = await User.findByPk(UserId);
        if (!user) return res.status(400).send('El usuario es inválido')
        const verifiedProductsPromises = products.map(async productToAdd => {
            try {
                const product = await Product.findByPk(productToAdd.id);
                if (!product) {
                    return 'El id de alguno de los productos enviados es inválido'
                };
                if (product.stock < productToAdd.quantity) {
                    return 'No hay stock suficiente de alguno de los productos'
                }
            } catch (err) {
                console.error(err)
                return err
            }
        })
        const error = await Promise.all(verifiedProductsPromises).then(result => result).catch(err => err)
        const concatError = [...new Set(error.filter(element => element))].join('. ')
        if (concatError) return res.status(400).send(concatError)
        await orderToDelete.destroy()
        const order = await Order.create()
        await user.addOrder(order);
        await products.forEach(async productToAdd => {
            try {
                const product = await Product.findByPk(productToAdd.id);
                const quantity = Number(productToAdd.quantity);
                const price = product.price
                await product.addOrder(order, { through: { orderId: order.id, quantity, price } })
            } catch (err) {
                console.error(err)
            }
        })
        return res.send('La orden fue actualizada con éxito')
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