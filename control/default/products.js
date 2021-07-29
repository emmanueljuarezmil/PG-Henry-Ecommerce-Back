const { Product, Category, Review, User } = require('../../db.js');
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");
const productosmeli = require('../../bin/data/productsDB.json');
const axios = require('axios')
const {backendURL} = process.env

const itemsPerPage = 10

const exclude = ['createdAt', 'updatedAt']

async function getProducts(req, res, next) {
    let { name, page, orderBy, orderType, category, descFilter } = req.query
    const validate = ['null', undefined, 'undefined', '']
    if (validate.includes(name)) name = ''
    if (validate.includes(page)) page = 1
    if (validate.includes(orderBy)) orderBy = 'name'
    if (validate.includes(orderType)) orderType = 'asc'
    if (validate.includes(category)) category = ''
    if (descFilter === 'true' ) descFilter = true
    if (descFilter === 'false' || validate.includes(descFilter)) descFilter = false
    const where = descFilter ?
    {
        [Op.and]: [
            {name: { [Op.iLike]: `%${name}%` }},
            {perc_desc: {[Op.not]: 0}}
        ]
    } :
    {
        name: { [Op.iLike]: `%${name}%` }
    }
    try {
        const count = await Product.findAll({
            where,
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
            where,
            attributes: {
                exclude
            },
            offset: (page - 1) * itemsPerPage,
            limit: itemsPerPage,
            include: [
                {
                    model: Category,
                    where: category ? {
                        id: category
                    } : null,
                    through: {
                        attributes: [],
                    },
                    attributes: ['name', 'id']
                },
                {
                    model: Review,
                    through: {
                        attributes: [],
                    },
                    attributes: ['rating']
                }
            ],
            order: [[orderBy, orderType]]
        })
        console.log('llegoooooo')
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
                    attributes: ['comment', 'rating'],
                    through: {
                        attributes: [],
                    },
                    include: {
                        model: User,
                        attributes: ['name', 'userName']
                    }
                }
            ]
        })
        if(!product) return next({message: "No se ha encontrado un producto con el id enviado"})
        product.views= product.views + 1
        await product.save()
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
    if (!id) return next({ message: 'El id del producto es requerido'})
    try {
        const product = await Product.findByPk(id, {include: User})
        if (!product) return next({ message: 'El id del producto es incorrecto'})
        if (product.Users && product.stock === 0 && stock > 0){
            product.Users.map((user) => {
                axios(`${backendURL}/user/sendmail?type=available`,{
                    headers: {
                        name: user.name,
                        email: user.email,
                        idproduct: id
                    },
                    data: {
                        prodName: name
                    }
                })
            })
        }
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
        return res.send('El producto ha sido actulizado')
    } catch (error) {
        next(error)
    }
}

async function deleteProduct(req, res, next) {
    const { id } = req.body;
    if (!id) return next({ message: 'El id del producto es requerido'})  
    try {
        await Product.destroy({
            where: {
                id
            }
        })
        return res.send('El producto fue borrado con éxito')
    } catch (error) {
        next(error);
    }
}

async function fullDbproducts(req, res, next) {
    for (let i of productosmeli) {
        try {
            var id = uuidv4();
            var prodFinal = await Product.create({ name: i.name, id: id, price: i.price, photo: i.photo, description: i.descript, stock: i.stock, perc_desc: i.perc_desc, views: i.views })
            await prodFinal.setCategories(i.Categorias);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
    if (req) return res.send('meli products posted ok');
    else return
}

async function getProductsForSearchBar(req,res,next) {
    try {
        const products = await Product.findAll({
            attributes: ['name', 'id']
        })
        res.send(products)
    } catch (err) {
        console.error(err)
    }
}


module.exports = {
    getProducts,
    getProductsById,
    addProduct,
    updateProduct,
    deleteProduct,
    fullDbproducts,
    getProductsForSearchBar
}


