const {Product, Category} = require('../../db.js');
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");
const productosmeli = require('../../bin/data/productsDB.json');

const itemsPerPage = 40

async function getProducts (req, res, next) {
    console.log(req.query)
    let { name, page, orderBy, orderType, category} = req.query
    if(name === '') name = ''
    if(page === '') page = 1
    if(orderBy === '') orderBy = 'name'
    if(orderType === '' || orderType === 'undefined') orderType = 'asc'
    if(category === '') category = ''
    name = name.toLowerCase()
    category = category.toLowerCase()
    orderType = orderType.toUpperCase()
    try {
        const count = await Product.findAll({
            where: {
                name:  {[Op.iLike]: `%${name}%`}
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
                name:  {[Op.iLike]: `%${name}%`}
            },
            attributes: ['name', 'photo', 'id', 'price', 'description'],
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
        return res.send({totalPage: Math.ceil(count.length/itemsPerPage), products })
    } catch(err) {
        next(err)
    }
}


async function getProductsById(req, res) {
    const {idProduct} =req.params;
        try{
           const product = await Product.findOne({
                where:{
                    id: idProduct},
                include: {
                    model: Category,
                    attributes: {
                        include: ['id', 'name'],
                        exclude: ['createdAt', 'updatedAt','product_categories']
                    },
                    through: {
                        attributes: []
                    }
                },
                attributes: {
                    exclude: ['createdAt', 'updatedAt','product_categories']
                }})       
           return res.status(200).json(product);
        } catch (error){
            return res.status(400).json({message: 'bad request', status:400})
        }
}


async function addProduct(req, res, next){
    console.log(req.body)
    const {name, price, photo, stock, selled, description, category, perc_desc} = req.body
    if(!name || !name.length || !price || !stock || !category.length) {
        return res.status(400).send({      
            message: 'Parámetros incorrectos',
        });
    }
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

    try{
        const createdProduct = await Product.create(products);
        if(category){
            await createdProduct.addCategory(category)

        }
        const result = await Product.findOne({
            where: {
                name: name
            },
            include: {
                model: Category,
                attributes: {
                    include: ['id', 'name'],
                    exclude: ['createdAt', 'updatedAt','product_categories']
                },
                through: {
                    attributes: []
                }
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt','product_categories']
            }
            
        });
        return res.status(200).json(result);
    }catch(error){
        next(error)
        // return res.status(500).json({message: "internal error DB"});
    }
}



async function updateProduct(req,res){
    if (!req.body.id){
        return res.status(400).json({message: 'ID of the edited product is needed', status:400})
    }
    const { id, name, photo, description, stock, selled, perc_desc, price, category} = req.body;
    try{
        const product = await Product.findByPk(id)
        if (name) {product.name = name}
        if (description) {product.description = description}
        if (stock) {product.stock = parseFloat(stock)}
        if (photo) {product.photo = photo}
        if (selled) {product.stock_spell = parseFloat(selled)}
        if (perc_desc) {product.perc_desc = parseFloat(perc_desc)}
        if (price) {product.price = parseFloat(price)}
        if(category && category.length){
            await product.addCategory(category)
        }
        await product.save()
        return res.status(200).json({message: 'El producto ha sido actulizado'})
    } catch (error){
        next(error)
    }   
}

async function deleteProduct(req,res, next){
    if (!req.body.id){
        return res.status(400).json({message: 'ID of the deleted product is needed', status:400})
    }
    const {id} = req.body;
    try{
        await Product.destroy({
            where: {
                id: id
            }
        })
        return res.status(200).send('the product was succesfully deleted')
    } catch(error) {
        next(error);
    }
}

 async function fullDbproducts(req,res, next){
    for(let i of productosmeli){
        try{
            var id = uuidv4();
            var prodFinal = await Product.create({name: i.name,id:id, price:i.price, photo: i.photo, description: i.descript, stock: i.stock})
            await prodFinal.setCategories(i.Categorias);
        }catch(error){
            console.log(error);
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


