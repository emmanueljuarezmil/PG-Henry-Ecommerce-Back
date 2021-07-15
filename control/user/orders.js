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
    
};

const updateOrder = async (req, res, next) => {
    
};
 
 module.exports = {
     getAllOrders,
     userOrders,
     getOrderById,
     updateOrder    
 }