const mercadopago = require('mercadopago');

mercadopago.configure({
    access_token: 'TEST-8789872387478002-072018-39547c2bf6daa53c28464d98745087ae-234872204',
});

async function checkoutMP (req, res, next) {
    const { products } = req.body;
    
    const itemsToMP = products.map(product => {
        return {
            unit_price: Number(product.price),
            quantity: Number(product.quantity),
            title: product.name,
        };
    });
    
    const preference = {
        items: itemsToMP,
        back_urls: {
            success: 'http://localhost:3001',
            failure: 'http://localhost:3001',
            pending: 'http://localhost:3001',
        },
        auto_return: 'approved',
    };
    mercadopago.preferences.create(preference)
    .then(response => {
        res.send(response.body);
    })
    .catch(err => console.log(err));   
}

module.exports = {
    checkoutMP
};
