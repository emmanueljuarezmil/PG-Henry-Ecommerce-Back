const { User, Product, Order, Order_Line } = require('../../db.js');

const exclude = ['createdAt', 'updatedAt']

const validateUser = async (id) => {
    if (!id) return true
    const user = await User.findByPk(id)
    if (!user) return true
}

const addCartItem = async (req, res, next) => {
    if (validateUser(req.params.idUser)) return res.status(400).send("Correct idUser is required ")
    try {
        const product = await Product.findByPk(req.body.id);
        if (!product) {
            return res.status(400).send("product not found")
        };
        const quantity = Number(req.body.quantity);
        if (product.stock < quantity) {
            return res.status(400).send("Stock unavaiable")
        };
        const price = product.price //- (product.price * (product.discount / 100));
        const user = await User.findOne({
            where: {
                id: req.params.idUser
            }
        });
        if (!user) {
            return res.status(400).send("user not found")
        };
        let order = await Order.findOne({ where: { UserId: req.params.idUser, status: 'cart' } });
        if (!order) {
            order = await Order.create()
            user.addOrder(order);
        };
        await product.addOrder(order, { through: { orderId: order.id, quantity, price } })
            .then(response => {
                res.send(response);
            })
    } catch (err) {
        console.log(err)
        // next(err)
        return res.status(400).send(err)
    }
};

const getCartEmpty = async (req, res, next) => {
    if (validateUser(req.params.idUser)) return res.status(400).send("Correct idUser is required ")
    try {
        const cart = await Order.destroy({
            where: {
                UserId: req.params.idUser
            },
        })
        return res.status(200).json({message:'All products in your cart have been removed'})
    } catch (error) {
        next(error);
    } 
};

const getAllCartItems = async (req, res, next) => {
    if (validateUser(req.params.idUser)) return res.status(400).send("Correct idUser is required ")
    try {
        const cart = await Order.findAll({
            where: {
                UserId: req.params.idUser
            },
            attributes: {
                exclude
            }
        })
        if(!cart.length){
            return res.status(400).json({message:'There are not products in your cart yet.'})
        }
        return res.status(200).json(cart)
    } catch (error) {
        next(error);
    } 
};

const editCartQuantity = async (req, res, next) => {
    if (validateUser(req.params.idUser)) return res.status(400).send("Correct idUser is required ")
};

module.exports = {
    addCartItem,
    getCartEmpty,
    getAllCartItems,
    editCartQuantity
}