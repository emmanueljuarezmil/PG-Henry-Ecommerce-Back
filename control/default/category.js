const {Product, Category} = require('../../db.js');
const { Op } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
const categoriesDb = require('../../bin/data/categories.json')

const newCategory = async (req, res) => {
    if (!req.body.name) {return res.status(500).json({message: `The category don't have a name`})};
    const catExist = await Category.findOne({where: {
        name: req.body.name
    }})
    if (catExist !== null) {return res.status(500).json({message: `The category already exist`})}
    try {
        const id = uuidv4();
        const name = req.body.name
        const catNew = {name, id};
        const cat = await Category.create(catNew)
        if (req.body.prods) {
            cat.addProduct(req.body.prods);
        }
        return res.status(201).json({message: 'Category created'})
    } catch {
        return res.status(500).json({message: `Internal server Error`})
    }
}

const prodByCatId = async(req, res) => {
    const {id} = req.params
    try {
        const prods = await Category.findByPk(id, {include: Product})
        return res.status(200).json(prods)
    } catch {
        return res.status(500).json({message: 'Internal Error server'})
    }
}

const productsByCategory = async (req, res) => {
    if (req.params.catName){
    const {catName} = req.params
    try {
        const prod = await Category.findAll({where :{name : {[Op.iLike]: `%${catName}%`}},include: Product})
        return res.status(200).json(prod)
    }
    catch {
        return res.status(400).json({message: 'Bad request', status: 400})
    }}
}

const addOrDeleteCategory = async (req, res, next) => {    // crear ruta para agregar categoria o sacarle a un producto
    if(!req.body.id) return res.status(500).send({message: "ID is required"})
    if(!req.body.category) return res.status(500).send({message: "category is required"})
    const {id, category} = req.body
    try {
        const product = await Product.findOne({
            where: {
                id: id
            },
            include: Category
        })
        if(!product) return res.status(500).send('The product you are trying to change does no exist')
        
        req.body.add ? await product.addCategory(category) : null        
        req.body.delete ? await product.removeCategory(category) : null
        
        return res.status(200).json(product)
        
    }
        catch(error) {
            next(error)
        }
}

const updateCategory = async (req, res, next) => {
    if(!req.body.id) return res.status(500).send({message: "id is required"})
    try {
        const {name} = req.body
        if(name){
            await Category.update({name: name}, {
                where: {
                    id: req.body.id
                }
            })
        }
        return res.status(501).send("category updated")
    }
    catch(error){
        next(error)
    }
}

const deleteCategory = async (req, res) => {
    if(!req.body.id) return res.status(400).send("ID is required")
    const {id} = req.body
    try {
            await Category.destroy({
                where: {
                    id: id
                }
            })
            return res.send("The category was succesfully deleted")
    }
    catch (error){

        next(error)
    }

}

const getAllCategories = async (req, res, next) => {
    if (req.query.name){
        const {name} = req.query
        const lowercasename = decodeURI(name.toLowerCase());
        try{
           const prod = await Category.findAll({
                where: {
                    name: {[Op.iLike]: `%${lowercasename}%`}
                },
                include: Product
           })
           return res.status(200).json(prod)
        } catch(error) {
            return res.status(500).json({message:'Error in DB'})
        }
    } else {
    try {
        const cat = await Category.findAll()
        return res.status(200).json(cat)
    } catch {
        return res.status(400).json({message: 'Algo ha fallado'})
    }
    }
}

const fulldbCat = async(req, res, next) => {
    try {
        await Category.bulkCreate(categoriesDb);
        return res.send("created ok");

    } catch(error){
        next(error);
    }
}


module.exports = {
    productsByCategory, 
    newCategory, 
    addOrDeleteCategory, 
    updateCategory, 
    deleteCategory,
    getAllCategories,
    prodByCatId,
    fulldbCat
}
