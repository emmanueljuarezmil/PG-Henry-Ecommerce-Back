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
    const randomComments = ['Muy bueno', "Excelente calidad", "Excelente Susana, me encanto el instrumento", "Excelente atención y excelente el producto"]
    try {
        const users = await User.findAll()
        const products = await Product.findAll()
        const promises = users.map(async user => {
            try {
                const id1 = uuidv4()
                const prod1 = await Product.findByPk(products[Math.floor(Math.random()*products.length)].id)
                const review1 = {
                    id: id1,
                    comment: randomComments[Math.round(Math.random()*randomComments.length)],
                    rating: Math.floor(Math.random()*3+3),
                    UserId: user.id,
                    ProductId: prod1.id
                }
                await Review.create(review1) 
                await prod1.addReview(review1.id)
                await user.addReview(review1.id)
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
