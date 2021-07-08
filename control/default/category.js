const {Product, Categories } = require('../../db.js');
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize")

const newCategory = async (req, res) => {
    if (!req.body.name) {return res.status(500).json({message: `The category don't have a name`})};
    const asd = await Categories.findOne({where: {
        name: req.body.name
    }})
    if (asd !== null) {return res.status(500).json({message: `The category already exist`})}
    try {
        //const id = uuidv4()
        const name = req.body.name
        //const catNew = {name, id};
        const catNew = {name}
        const cat = await Categories.create(catNew)
        if (req.body.prods) {
            req.body.prods.map(p => {
                cat.addProducts(p, {through:'product_categories'})
            })
        }
        return res.status(201).json({message: 'Category created'})
    } catch {
        return res.status(500).json({message: `Internal server Error`})
    }
}

const prodByCatId = async(req, res) => {
    const cat = req.body.id
    try {
        const prods = await Categories.findAll({
            where : {
                id: cat
            },
            include: Product
        })
        return res.status(200).json(prods)
    } catch {
        return res.status(500).json({message: 'Internal Error server'})
    }
}

const productsByCategory = async (req, res) => {
    if (req.params.catName){
    const cat = req.params.catName
    try {
        const prod = await Product.findAll({
            include: {
                model: Categories,
                where : {
                    name : {[Op.iLike]: `%${cat}%`}
                },
            }})
        return res.status(200).json(prod)
    }
    catch {
        return res.status(400).json({message: 'Bad request', status: 400})
    }}
}

const addOrDeleteCategory = async (req, res) => {    // crear ruta para agregar categoria o sacarle a un producto
    if(!req.body.id) return res.status(500).send({message: "ID is required"})
    if(!req.body.category) return res.status(500).send({message: "category is required"})
    try {
        const productDb= await Product.findOne({
            where: {
                id: req.body.id
            }
            
        })
        const newCats = req.body.category
        await product_categories.destroy({
            where: {
                ProductId: req.body.id
            }
        })
        console.log("entro")
        newCats.forEach(async element => {
            await productDb.addCategories(element, {through:'product_categories'})                
        })
        return status(200).json({message: 'Catergories updated'})
    }
        catch{
            return res.status(500).json({message: "Internal error in DB"})
        }
}

const updateCategory = async (req, res, next) => {
    if(!req.body.id) return res.status(500).send({message: "id is required"})
    try {
        const {name} = req.body
        if(name){
            await Categories.update({name: name}, {
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
            await Categories.destroy({
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

const getAllCategories = async (req, res) => {
    try {
        const cat = await Categories.findAll()
        return res.status(200).json(cat)
    } catch {
        return res.status(400).json({message: 'Algo ha fallado'})
    }
}


module.exports = {
    productsByCategory, 
    newCategory, 
    addOrDeleteCategory, 
    updateCategory, 
    deleteCategory,
    getAllCategories,
    prodByCatId
}