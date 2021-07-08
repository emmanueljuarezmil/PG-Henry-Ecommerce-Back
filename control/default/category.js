const {Producto, Categorias} = require('../../db.js');
const { v4: uuidv4 } = require('uuid');
const categoriesDb = require('../../bin/data/categories.json')

const newCategory = async (req, res) => {
    if (!req.body.name) {return res.status(500).json({message: `The category don't have a name`})};
    const asd = await Categorias.findOne({where: {
        name: req.body.name
    }})
    if (asd !== null) {return res.status(500).json({message: `The category already exist`})}
    try {
        const id = uuidv4();
        const name = req.body.name
        const catNew = {name, id};
        //const catNew = {name}
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

const prodByCatId = async(req, res) => {
    const cat = req.params.id
    try {
        const prods = await Categorias.findAll({
            where : {
                id: cat
            },
            include: Productos
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
    }}
}

const addOrDeleteCategory = async (req, res) => {    // crear ruta para agregar categoria o sacarle a un producto
    if(!req.body.id) return res.status(500).send({message: "ID is required"})
    if(!req.body.category) return res.status(500).send({message: "category is required"})
    try {
        const product= await Producto.findOne({
            where: {
                id: req.body.id
            },
            include: Categorias
        })
        const newCats = req.body.category
        await producto_categorias.destroy({
            where: {
                ProductoId: req.body.id
            }
        })
        newCats.forEach(async element => {
            await product.addCategorias(element, {through:'producto_categorias'})                
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
            await Categorias.update({name: name}, {
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
            await Categorias.destroy({
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
        const cat = await Categorias.findAll()
        return res.status(200).json(cat)
    } catch {
        return res.status(400).json({message: 'Algo ha fallado'})
    }
}

const fulldbCat = async(req, res, next) => {
    try {
        await Categorias.bulkCreate(categoriesDb);
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
