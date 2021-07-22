const { Product, Category, Review } = require('../../db.js');
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");
const productosmeli = require('../../bin/data/productsDB.json');

const itemsPerPage = 40

const exclude = ['createdAt', 'updatedAt']

async function getProducts(req, res, next) {
    let { name, page, orderBy, orderType, category } = req.query
    const validate = ['null', undefined, 'undefined', '']
    if (validate.includes(name)) name = ''
    if (validate.includes(page)) page = 1
    if (validate.includes(orderBy)) orderBy = 'name'
    if (validate.includes(orderType)) orderType = 'asc'
    if (validate.includes(category)) category = ''
    try {
        const count = await Product.findAll({
            where: {
                name: { [Op.iLike]: `%${name}%` }
            },
            attributes: [],
            include: {
                model: Category,
                where: category ? {
                    id: category
                } : null,
                through: {
                    attributes: [],
                },
                attributes: []
            }
        })
        const products = await Product.findAll({
            where: {
                name: { [Op.iLike]: `%${name}%` }
            },
            attributes: {
                exclude
            },
            offset: (page - 1) * itemsPerPage,
            limit: itemsPerPage,
            include: {
                model: Category,
                where: category ? {
                    id: category
                } : null,
                through: {
                    attributes: [],
                },
                attributes: ['name', 'id']
            },
            order: [[orderBy, orderType]]
        })
        return res.send({ totalPage: Math.ceil(count.length / itemsPerPage), products })
    } catch (err) {
        next(err)
    }
}


async function getProductsById(req, res, next) {
    const { idProduct } = req.params;
    if(!idProduct) return next({message: "El id es requerido"})
    try {
        const product = await Product.findOne({
            where: {
                id: idProduct
            },
            include: [
                {
                    model: Category,
                    through: {
                        attributes: [],
                    },
                    attributes: {
                        exclude
                    }
                },
                {
                    model: Review,
                    attributes: ['comment', 'rating']
                }
            ]
        })
        if(!product) return next({message: "No se ha encontrado un producto con el id enviado"})
        return res.status(200).json(product);
    } catch (err) {
        next(err)
    }
}


async function addProduct(req, res, next) {
    const { name, price, photo = [], stock, selled = 0, description, category, perc_desc = 0 } = req.body
    if (!name || !name.length || !price || !stock || !category || !category.length) return next({message: 'Parámetros incorrectos'});
    const id = uuidv4();
    const products = {
        id,
        name,
        price: parseFloat(price),
        stock: parseFloat(stock),
        selled: parseFloat(selled),
        photo,
        description,
        perc_desc: parseFloat(perc_desc)
    };

    try {
        const verifyName = await Product.findOne({
            where: {
                name
            }
        })
        if(verifyName) return next({message: 'Ya existe un producto con el nombre solicitado'});
        const createdProduct = await Product.create(products);
        await createdProduct.addCategory(category)
        const result = await Product.findOne({
            where: {
                name
            },
            include: {
                model: Category,
                attributes: ['id', 'name'],
                through: {
                    attributes: []
                }
            },
            attributes: {
                exclude
            }

        });
        return res.send(result);
    } catch (error) {
        next(error)
    }
}



async function updateProduct(req, res, next) {  
    const { id, name, photo, description, stock, selled, perc_desc, price, category } = req.body;
    if (!id) return next({ message: 'El id del producto requerido es requerido'})
    try {
        const product = await Product.findByPk(id)
        if (name) { product.name = name }
        if (description) { product.description = description }
        if (stock) { product.stock = parseFloat(stock) }
        if (photo) { product.photo = photo }
        if (selled) { product.stock_spell = parseFloat(selled) }
        if (perc_desc) { product.perc_desc = parseFloat(perc_desc) }
        if (price) { product.price = parseFloat(price) }
        if (category && category.length) {
            await product.addCategory(category)
        }
        await product.save()
        return res.send({ message: 'El producto ha sido actulizado' })
    } catch (error) {
        next(error)
    }
}

async function deleteProduct(req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({ message: 'ID of the deleted product is needed', status: 400 })
    }
    const { id } = req.body;
    try {
        await Product.destroy({
            where: {
                id: id
            }
        })
        return res.status(200).send('the product was succesfully deleted')
    } catch (error) {
        next(error);
    }
}

async function fullDbproducts(req, res, next) {
    for (let i of productosmeli) {
        try {
            var id = uuidv4();
            var prodFinal = await Product.create({ name: i.name, id: id, price: i.price, photo: i.photo, description: i.descript, stock: i.stock })
            await prodFinal.setCategories(i.Categorias);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
    if (req) return res.send('meli products posted ok');
    else return
}


module.exports = {
    getProducts,
    getProductsById,
    addProduct,
    updateProduct,
    deleteProduct,
    fullDbproducts
}


