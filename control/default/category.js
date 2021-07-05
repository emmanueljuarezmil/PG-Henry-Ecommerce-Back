const {Producto, Categorias} = require('../../db.js');
const { v4: uuidv4 } = require('uuid');

const newCategory = async (req, res) => {
    if (!req.body.name) {return res.status(500).json({message: `The category don't have a name`})}
    try {
        const asd = await Categoria.findOne({where: {
            name: req.body.name
        }})
        if (asd.length != 0) {return res.status(500).json({message: `The category already exist`})}
        const id = uuidv4()
        const catNew = {...req.body.name, id}
        const cat = await Categorias.create(catNew)
        if (req.body.prods) {
            prods.map(p => {
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
        const prod = await Producto.findAll({
            include: {
                model: Categorias,
                where : {
                    name : {[Op.iLike]: `%${cat}%`}
                }
            }
        })
        return res.status(200).json(prod)
    }
    catch {
        return res.status(400).json({message: 'Bad request', status: 400})
    }
}

const addOrDeleteCategory = async (req, res) => {

}

const updateCategory = async (req, res) => {

}

const deleteCategory = async (req, res) => {

}

module.exports = {
    productsByCategory, 
    newCategory, 
    addOrDeleteCategory, 
    updateCategory, 
    deleteCategory
}