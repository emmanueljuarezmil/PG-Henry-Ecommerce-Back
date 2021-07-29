const { Product, Review, User } = require('../../db.js');
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");

const newReview = async(req, res, next) => {
    const { comment, rating, idProd } = req.body
    const { idUser } = req.params
    if (!comment) return res.send({message: "Se precisa comentario"})
    if(!rating ) return res.send({message: "Se precisa rating"})
    try {
        const id = uuidv4()
        const verifyDuplicate = await Review.findOne({
            where: {
                UserId: idUser,
                ProductId: idProd
            }
        })
        if(verifyDuplicate) return res.send({message: "Ya has realizado una reseña de este producto"})
        await Review.create({
            id,
            rating,
            comment,
            UserId: idUser,
            ProductId: idProd
        })
        const Prod = await Product.findByPk(idProd)
        await Prod.addReview(id)
        const user = await User.findByPk(idUser)
        await user.addReview(id)
        return res.send({message: 'Gracias por tu reseña'})
    } catch (error){
        next(error)
    }
}

const updateReview = async (req, res, next)  => {
	const {idRev} = req.body
	try{
		const rev = Review.findByPk(idRev)
		if (req.body.comment) rev.comment = comment;
		if (req.body.rating) rev.rating = rating;
		rev.save()
		return res.status(200).json({message: 'Review updated'})
	}catch(error){
		return res.status(500).json({message: 'Error DB'})
	}

}

const deleteReview = async (req, res, next) => {
	try {
        	await Review.destroy({
            	where: {
                	id: req.body.idRev
            	}
        })
        return res.status(200).send('the review was succesfully deleted')
    } catch (error) {
        next(error);
    }
}

const addReviewsAutomatic = async () => {
    const randomComments = ['Muy bueno',
        "Excelente calidad",
        "Excelente, me encanto el instrumento",
        "Excelente atención y excelente el producto",
        "Suena excelente, recomendadisimo",
        "Muy buena relación precio calidad",
        "Suena muy lindo",
        "Me compraria 5 más",
        "Me encanta",
        "Muy bueno",
        " ",
        " ",
        " ",
        " ",
        " ",
        " ",
        " "
    ]
    try {
        const users = await User.findAll()
        const products = await Product.findAll()
        for(let user of users) {
            for(let product of products) {
                const id = uuidv4()
                const review = {
                    id,
                    comment: randomComments[Math.round(Math.random()*randomComments.length)],
                    rating: Math.floor(Math.random()*3+3),
                    UserId: user.id,
                    ProductId: product.id
                }
                const newReview = await Review.create(review)
                await product.addReview(newReview)
                await user.addReview(newReview)
            }
        }
    } catch(err) {
        console.error(err)
    }
}

module.exports = {
    newReview, 
    updateReview, 
    deleteReview,
    addReviewsAutomatic
}
