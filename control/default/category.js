const {Product, Category} = require('../../db.js');
const { Op } = require("sequelize");
const { v4: uuidv4 } = require('uuid');
const categoriesDb = require('../../bin/data/categories.json')

const exclude = ['createdAt', 'updatedAt']

const newCategory = async (req, res, next) => {
    if (!req.body.name) return next({message: 'La categoria debe tener un nombre'})
    const catExist = await Category.findOne({where: {
        name: req.body.name
    }})
    if (catExist !== null) return next({message: `La categoria ya existe`})
    try {
        const id = uuidv4();
        const name = req.body.name
        const catNew = {name, id};
        const cat = await Category.create(catNew)
        if (req.body.prods) {
            cat.addProduct(req.body.prods);
        }
        return res.send('Categoria creada')
    } catch(err) {
        next(err)
    }
}

const prodByCatId = async(req, res, next) => {
    const {id} = req.params
    if(!id) return next({message: 'El id de la categoria es requerido'})
    try {
        const prods = await Category.findOne({
            where: {
                id
            },
            include: {
                model: Product,
                through: {
                    attributes: [],
                },
                attributes: ['name', 'id', 'price']
            }
        })
        return res.send(prods)
    } catch(err) {
        next(err)
    }
}

const productsByCategory = async (req, res, next) => {
    const {catName} = req.params
    if(!catName) return next({message: 'El nombre de la categoria es requerido'})
    try {
        const prod = await Category.findAll({
            where: {
                name: {
                    [Op.iLike]: `%${catName}%`
                }
            },
            include: {
                model: Product,
                through: {
                    attributes: [],
                },
                attributes: ['name', 'id', 'price']
            },
            attributes:{
                exclude
            }
        })
        return res.send(prod)
    } catch(err) {
        next(err)
    }
}

const addOrDeleteCategory = async (req, res, next) => {    // crear ruta para agregar categoria o sacarle a un producto
    const {id, addCategory, deletedCategory, add = false, deleteCat = false} = req.body
    if(!id) return next({message: "El id del producto es requerido"})
    if(!add && !deleteCat) return next({message: "Debes realizar al menos una acción, agregar o quitar categorias"})
    if(add && !addCategory) return next({message: "Las categorias a añadir son requeridas"})
    if(deleteCat && !deletedCategory) return next({message: "Las categorias a borrar son requeridas"})
    try {
        const product = await Product.findOne({
            where: {
                id: id
            },
            include: {
                model: Category,
                through: {
                    attributes: [],
                },
                attributes: ['name', 'id']
            },
            attributes:{
                exclude
            }
        })
        if(!product) return next({message: "No se encontro el producto"})       
        add ? await product.addCategory(addCategory) : null        
        deleteCat ? await product.removeCategory(deletedCategory) : null
        const productSend = await Product.findOne({
            where: {
                id: id
            },
            include: {
                model: Category,
                through: {
                    attributes: [],
                },
                attributes: ['name', 'id']
            },
            attributes:{
                exclude
            }
        })    
        return res.send(productSend)      
    } catch(err) {
        next(err)
    }
}

const updateCategory = async (req, res, next) => {
    const {id, name} = req.body
    if(!id) return next({message: "El id es requerido"})
    if(!name) return next({message: "El nombre nuevo es requerido"})
    try {
        await Category.update({name}, {
            where: {
                id
            }
        })
        return res.send("Categoria actualizada")
    } catch(err) {
        next(err)
    }
}

const deleteCategory = async (req, res, next) => {
    const {id} = req.params
    if(!id) return next({message: "El id de la categoria es requerido"})
    try {
            const category = await Category.findByPk(id)
            console.log(category)
            if(category) await category.destroy()
            else return next({message: "El id de la categoria es invalido"})
            // await Category.destroy({
            //     where: {
            //         id
            //     }
            // })
            return res.send("La categoria fue borrada con éxito")
    } catch(err) {
        next(err)
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
           return res.status(200).send(prod)
        } catch(error) {
            return res.status(500).send({message:'Error in DB'})
        }
    } else {
        try {
            const cat = await Category.findAll()
            return res.status(200).send(cat)
        } catch(err) {
            next(err)
            }
        }
}

const fulldbCat = async(req, res, next) => {
    try {
        await Category.bulkCreate(categoriesDb);
        if(req) return res.send("created ok");
        else return

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
