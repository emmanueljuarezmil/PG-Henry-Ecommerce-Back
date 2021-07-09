const {Product, Category} = require('../../db.js');
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");
const productosmeli = require('../../bin/data/productsDB.json');




async function getProducts (req, res, next) {
    const { name } = req.query
    if(name){
        var lowercasename = decodeURI(name.toLowerCase());
        try{
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
            return res.status(200).send(prod);
        } catch (error){
            next(error)
        }
    } 
    try {
        const products = await Product.findAll({
            include: {                
                    model: Category,
                    through: {
                        attributes: [],
                    },
                    attributes: ['name', 'id']
                },
            attributes: ['name', 'photo', 'id', 'price']    
        })
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


async function addProduct(req, res){
    const id = uuidv4();
    const products = {...req.body, id: id};
    if(!req.body.name || !req.body.price || !req.body.stock) {
        return res.send({      
            message: 'you have to set a name for your product',
        });
    }
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
        return res.status(500).json({message: "internal error DB"});
    }
}



async function updateProduct(req,res){
    if (!req.body.id){
        return res.status(400).json({message: 'ID of the deleted product is needed', status:400})
    }
    const { id, name, photo, description, stock, selled, perc_desc, price} = req.body;
    try{
        const product = await Product.findByPk(id)
        if (name) {product.name = name}
        if (description) {product.descrip = description}
        if (stock) {product.stock = stock}
        if (photo) {product.photo = photo}
        if (selled) {product.stock_spell = selled}
        if (perc_desc) {product.perc_desc = perc_desc}
        if (price) {product.price = price}
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
            var prodFinal = await Product.create({name: i.name,id:id, price:i.price, photo: i.photo, descrip: i.descript, stock: i.stock})
            await prodFinal.setCategories(i.Categorias);
        }catch(error){
            console.log(error);
            next(error);
        }
    }
    return  res.send('meli products posted ok');
   
}


module.exports = {
    getProducts,
    getProductsById,
    addProduct, 
    updateProduct,
    deleteProduct,
    fullDbproducts
}


