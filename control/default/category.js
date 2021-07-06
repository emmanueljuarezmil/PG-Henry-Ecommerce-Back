const {Producto, Categorias} = require('../../db.js');
const { v4: uuidv4 } = require('uuid');
const { nextTick } = require('process');

const newCategory = async (req, res) => {
    if (!req.body.name) {return res.status(500).json({message: `The category don't have a name`})};
    const asd = await Categorias.findOne({where: {
        name: req.body.name
    }})
    if (asd !== null) {return res.status(500).json({message: `The category already exist`})}
    try {
        const id = uuidv4()
        const name = req.body.name
        const catNew = {name, id};
        const cat = await Categorias.create(catNew)
        if (req.body.prods) {
            req.body.prods.map(p => {
                cat.addProductos(p, {through:'producto_categorias'})
            })
        }
        return res.status(201).json({message: 'Category created'})
    } catch {
        return res.status(500).json({message: `Internal server Error`})
    }
}

const productsByCategory = async (req, res) => {
    const cat = req.params.catName
    try {
        const prod = await Productos.findAll({
            include: {
                model: Categorias,
                where : {
                    name : {[Op.iLike]: `%${cat}%`}
                },
            }})
        return res.status(200).json(prod)
    }
    catch {
        return res.status(400).json({message: 'Bad request', status: 400})
    }
}

const addOrDeleteCategory = async (req, res) => {    // crear ruta para agregar categoria o sacarle a un producto

}

const updateCategory = async (req, res, next) => {
    try {if(!req.params.idCategory) return res.status(500).send({message: "id is required"})
    const {name} = req.body
    if(name){
        await Categorias.update({name: name}, {
            where: {
                id: req.params.idCategory
            }
        })
    }
    return res.send("category updated")
    }
    catch(error){
        next(error)
    }
}

const deleteCategory = async (req, res, next) => {
    if(!req.params.idCategory) return res.status(400).send("ID is required")
    const {idCategory} = req.params
    try {
            await Categorias.destroy({
                where: {
                    id: idCategory
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
        const cat = await Categorias.findAll()
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
    getAllCategories
}