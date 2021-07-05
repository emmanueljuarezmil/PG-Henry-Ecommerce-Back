const {Producto, Categorias} = require('../../db.js');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');

async function getProducts (req,res) {
    if(req.query.name){
        const lowercasename = decodeURI(req.query.name.toLowerCase()); // chequear si anda bien 
        try{
           const product = await Producto.findOne({
               where:{
                   name: lowercasename
               }// le habia puesto que incluya categorias pero como es la busqueda no es necesario
           })
           const searchedProduct = {
               name: product.name.charAt(0).toUpperCase() + product.name.slice(1),
               photo: product.photo,
               price: product.price,
               id: product.id
           }
           return res.status(200).send(searchedProduct);
        } catch (error){
            return res.status(404).send("The product you are looking for does not exist");
        }
    } 
    try {
        const products = await Producto.findAll({
            include: {
                attributes: ['name'],
                model: Categorias,
                through: {
                    attributes: [],
                }
            }        
        })
        const homeProducts = products.map(result => {
            return {
                    name: result.name.charAt(0).toUpperCase() + result.name.slice(1),
                    photo: result.photo,
                    id: result.id,
                    price: result.price,
                    //category: product.categorias VER CUANDO HAGO UN POST COMO SE LLAMA LA PROPIEDAD PARA PONERLA BIEN
            }
        })
        return res.status(200).send(homeProducts);
    } catch (error) {
        return res.status(400).send("Bad Request");
    }
}


async function getProductsById(req, res) {
        try{
           const product = await Producto.findOne({
               where:{
                   id: req.body.id
               }
           })
           const searchedProduct = {
               name: product.name.charAt(0).toUpperCase() + product.name.slice(1),
               photo: product.photo,
               price: product.price,
               id: product.id
           }
           return res.status(200).send(searchedProduct);
        } catch (error){
            return res.status(400).json({message: 'bad request', status:400})
        }
}


async function addProduct(req, res, next){
    const id = uuidv4();
    const product = {...req.body, id: id};
    if(!req.body.name) {
        return res.send({      
            message: 'you have to set a name for your product',
        });
    }
    try{
        const createdProduct = await Producto.create(product);
        if (req.body.cat) {const cats = req.body.cat
            cats.forEach(async (element) => {
                await createdProduct.addCategorias(element, {through:'producto_categorias'})
            });
        }
        const result = await Producto.findOne({
            where: {
                name: req.body.name
            },
            include: Categorias // AGREGAR CATEGORIAS PRIMER
        });
        return res.status(200).json(result);
    }catch(error){
        next(error)
    }
}

async function updateProduct(req,res){

}

async function deleteProduct(req,res){

}



module.exports = {
    getProducts,
    getProductsById,
    addProduct, 
    updateProduct,
    deleteProduct
}


