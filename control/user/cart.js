const { User, Product, Order, Order_Line } = require('../../db.js');

const exclude = ['createdAt', 'updatedAt']

const addCartItem = async (req, res, next) => {
    if (!req.params.idUser) return res.status(400).send("Es necesario un ID correcto de Usuario")
    try {
        const product = await Product.findByPk(req.body.id);
        if (!product) {
            return res.status(400).send("Producto no encontrado")
        };
        const quantity = Number(req.body.quantity);
        if (product.stock < quantity) {
            return res.status(400).send("Stock no disponible")
        };
        const price = product.price //- (product.price * (product.discount / 100));
        const user = await User.findOne({
            where: {
                id: req.params.idUser
            }
        });
        if (!user) {
            return res.status(400).send("Usuario no encontrado")
        };
        let order = await Order.findOne({ where: { UserId: req.params.idUser, status: 'cart' } });
        if (!order) {
            order = await Order.create()
            user.addOrder(order);
        };
        const createdProduct = await product.addOrder(order, { through: { orderId: order.id, quantity, price } })
        return res.send("Producto agregado con exito", createdProduct);
    } catch (err) {
        next(err)
    }
};

const getCartEmpty = async (req, res, next) => {
    if (!req.params.idUser) return res.status(400).send("Es necesario un ID correcto de Usuario")
    try {
        const cart = await Order.destroy({
            where: {
                UserId: req.params.idUser
            },
        })
        return res.status(200).json({ message: "Todos los productos de su carrito han sido eliminados" })
    } catch (error) {
        next(error);
    }
};

const getAllCartItems = async (req, res, next, idUser = null) => {
    try {
        if (!req.params.idUser && !idUser) return res.status(400).send("Es necesario un ID correcto de Usuario")
        const order = await Order.findOne({
            where: {
                UserId: req.params.idUser || idUser,
                status: 'cart'
            },
            attributes: {
                exclude
            }
        })

        const raw_cart = await Product.findAll({
            include: { model: Order, where: { id: order.id } },
            order: ['name']
        })

        if (!raw_cart.length) {
            return res.status(400).json({ message: "Todavia no posee items en su carrito" })
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
    if (!req.params.idUser) return res.status(400).send("Es necesario un ID correcto de Usuario")
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
    if (!req.params.idUser) return res.status(400).send("Es necesario un ID correcto de Usuario")
    try {
        const orderId = await Order.findOne({ where: { UserId: req.params.idUser } });
        if (!orderId) {
            res.status(400).send("Usuario no encontrado")
        };
        let order = await Order_Line.findOne({ where: { orderID: orderId.dataValues.id, productID: req.params.idProduct } });
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