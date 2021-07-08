const {Product, Category} = require('../../db.js');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const { Op } = require("sequelize");
const productosmeli = require('../../bin/data/productsDB.json');




async function getProducts (req, res, next) {
    const { name } = req.query
    let categoryMap = [];
    if(name){
        var lowercasename = decodeURI(name.toLowerCase()); // chequear si anda bien  // chequear si anda bien 
        try{
           var prod = await Product.findAll({
                where: {
                    name:  {[Op.iLike]: `%${lowercasename}%`}
                },
                include: Category
           })
           var searchedProduct = prod.map( p => {
               categoryMap=[];
                p.dataValues.Categories.map(cat => categoryMap.push(cat.dataValues.name))
                return {
                    name: p.dataValues.name.charAt(0).toUpperCase() + p.dataValues.name.slice(1),
                    photo: p.dataValues.photo,
                    price: p.dataValues.price,
                    id: p.dataValues.id,
                    category: categoryMap
                }
            })
            return res.status(200).send(searchedProduct);
        } catch (error){
            //return res.status(404).send("The product you are looking for does not exist");
            next(error)
        }
    } 
    try {
        const products = await Product.findAll({
            include: {
                attributes: ['name'],
                model: Category,
                through: {
                    attributes: [],
                }
            }        
        })
        const homeProducts = products.map(result => {
            categoryMap=[];
            result.dataValues.Categories.map(cat => categoryMap.push(cat.dataValues.name))
            return {
                    name: result.name.charAt(0).toUpperCase() + result.name.slice(1),
                    photo: result.photo,
                    id: result.id,
                    price: result.price,
                    category: categoryMap
            }
        })
        return res.status(200).send(homeProducts);
    } catch (error) {
        next(error);
    }
}


async function getProductsById(req, res) {
    const {idProduct} =req.params
    let categoryMapAux = []
        try{
            // const searchedProduct = await Product.findByPk(idProduct,{include: Category})
           const product = await Product.findByPk(idProduct, {include: Category })        //    console.log(product);
            product.Categories.map(cat => categoryMapAux.push(cat.dataValues.name))
           const searchedProduct = {
               name: product.name.charAt(0).toUpperCase() + product.name.slice(1),
               photo: product.photo,
               descripion: product.descrip,
               stock: product.stock,
               selled: product.stock_spell,
               perc_desc: product.perc_desc,
               price: product.price,
               id: product.id,
               category: categoryMapAux
           }
           return res.status(200).json(searchedProduct);
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
        for(let i=0; i<req.body.Categorias.length; i++){
            await createdProduct.addCategory(req.body.Categorias[i], {through:'product_categories'})
        }
    }
    /*     if(req.body.category){
            const cats = req.body.category;
        
            cats.forEach(async (element) => {
                await createdProduct.addCategorias(element, {through:'producto_categorias'})
            });
        } */
        const {name} = req.body 
        const result = await Producto.findOne({
            where: {
                name: name
            },
            include: Category // AGREGAR CATEGORIAS PRIMER
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
            var prodFinal = await Product.create({name: i.name,id:id, price:i.price, photo: i.photo, descrip: i.descrip, stock: i.stock})
            await prodFinal.setCategories(i.Categorias);
        }catch(error){
            console.log(error);
            next(error);
        }
    }
    return  res.send('meli products posted ok');
   /*  try{
        return res.send(db);

    }catch(error){
        next(error);
    } */
}


module.exports = {
    getProducts,
    getProductsById,
    addProduct, 
    updateProduct,
    deleteProduct,
    fullDbproducts
}


