const { Product, Review, User } = require('../../db.js');
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");
const reviewsDBJson = require('../../bin/data/reviews.json')

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
        "Excelente Susana, me encanto el instrumento",
        "Excelente atención y excelente el producto",
        "Suena excelente, recomendadisimo",
        "Muy buena relación precio calidad",
        "Suena muy lindo",
        "Me compraria 5 más"
    ]
    try {
        const users = await User.findAll()
        const products = await Product.findAll()
        let productIndex1=0
        let productIndex2=2
        let productIndex3=4
        let productIndex4=6
        let productIndex5=8
        let productIndex6=10
        const promises = users.map(async user => {
            try {
                const id1 = uuidv4()
                const id2 = uuidv4()
                const id3 = uuidv4()
                const id4 = uuidv4()
                const id5 = uuidv4()
                const id6 = uuidv4()
                const prod1 = await Product.findByPk(products[productIndex1++].id)
                const prod2 = await Product.findByPk(products[productIndex2++].id)
                const prod3 = await Product.findByPk(products[productIndex3++].id)
                const prod4 = await Product.findByPk(products[productIndex4++].id)
                const prod5 = await Product.findByPk(products[productIndex5++].id)
                const prod6 = await Product.findByPk(products[productIndex6++].id)
                const review1 = {
                    id: id1,
                    comment: randomComments[Math.round(Math.random()*randomComments.length)],
                    rating: Math.floor(Math.random()*3+3),
                    UserId: user.id,
                    ProductId: prod1.id
                }
                const review2 = {
                    id: id2,
                    comment: randomComments[Math.round(Math.random()*randomComments.length)],
                    rating: Math.floor(Math.random()*3+3),
                    UserId: user.id,
                    ProductId: prod2.id
                }
                const review3 = {
                    id: id3,
                    comment: randomComments[Math.round(Math.random()*randomComments.length)],
                    rating: Math.floor(Math.random()*3+3),
                    UserId: user.id,
                    ProductId: prod3.id
                }
                const review4 = {
                    id: id4,
                    comment: randomComments[Math.round(Math.random()*randomComments.length)],
                    rating: Math.floor(Math.random()*3+3),
                    UserId: user.id,
                    ProductId: prod4.id
                }
                const review5 = {
                    id: id5,
                    comment: randomComments[Math.round(Math.random()*randomComments.length)],
                    rating: Math.floor(Math.random()*3+3),
                    UserId: user.id,
                    ProductId: prod5.id
                }
                const review6 = {
                    id: id6,
                    comment: randomComments[Math.round(Math.random()*randomComments.length)],
                    rating: Math.floor(Math.random()*3+3),
                    UserId: user.id,
                    ProductId: prod6.id
                }
                await Review.create(review1) 
                await prod1.addReview(review1.id)
                await user.addReview(review1.id)
                await Review.create(review2) 
                await prod2.addReview(review2.id)
                await user.addReview(review2.id)
                await Review.create(review3) 
                await prod3.addReview(review3.id)
                await user.addReview(review3.id)
                await Review.create(review4) 
                await prod4.addReview(review4.id)
                await user.addReview(review4.id)
                await Review.create(review5) 
                await prod5.addReview(review5.id)
                await user.addReview(review5.id)
                await Review.create(review6) 
                await prod6.addReview(review6.id)
                await user.addReview(review6.id)
            } catch(err) {
                console.error(err)
            }      
        })
        await Promise.all(promises)
        .then(result => result)
        .catch(err => console.error(err))
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
