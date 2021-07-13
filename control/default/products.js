const {Product, Category} = require('../../db.js');
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");
const productosmeli = require('../../bin/data/productsDB.json');




async function getProducts (req, res, next) {
    const { name } = req.query
    if(name){
        var lowercasename = decodeURI(name.toLowerCase());
        try{
            if(req.query.page) {
                var prod = await Product.findAll({
                     where: {
                         name:  {[Op.iLike]: `%${lowercasename}%`}
                     },
                     limit: 40,
                     offset: req.query.page *40,
                     include: {                
                         model: Category,
                         through: {
                             attributes: [],
                         },
                         attributes: ['name', 'id']
                     },
                    attributes: ['name', 'photo', 'id', 'price'] 
                })

            } else {
                var prod = await Product.findAll({
                    where: {
                        name:  {[Op.iLike]: `%${lowercasename}%`}
                    },
                    include: {                
                        model: Category,
                        through: {
                            attributes: [],
                        },
                        attributes: ['name', 'id']
                    },
                   attributes: ['name', 'photo', 'id', 'price'] 
               })

            }
            return res.status(200).send(prod);
        } catch (error){
            next(error)
        }
    } 
    try {
        if(req.query.page) {
            var products = await Product.findAll({
                limit:  40,
                offset: req.query.page * 40,
                include: {                
                        model: Category,
                        through: {
                            attributes: [],
                        },
                        attributes: ['name', 'id']
                    },
                attributes: ['name', 'photo', 'id', 'price']    
            })

        } else {
            var products = await Product.findAll({
                include: {                
                        model: Category,
                        through: {
                            attributes: [],
                        },
                        attributes: ['name', 'id']
                    },
                attributes: ['name', 'photo', 'id', 'price']    
            })

        }
        return res.status(200).send(products);
    } catch (error) {
        next(error);
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
    if(!req.body.name || !req.body.name.length || !req.body.price || !req.body.stock) {
        return res.send({      
            message: 'you have to set a name for your product',
        });
    }
    const id = uuidv4();
    const products = {
        id: id,
        name: req.body.name,
        price: parseFloat(req.body.price),
        stock: parseFloat(req.body.stock),
        photo: req.body.photo,
    };

    try{
        const createdProduct = await Product.create(products);
        if(req.body.category){
            const {category} = req.body
            await createdProduct.addCategory(category)

        }
        const {name} = req.body 
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
            var prodFinal = await Product.create({name: i.name,id:id, price:i.price, photo: i.photo, description: i.description, stock: i.stock})
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


