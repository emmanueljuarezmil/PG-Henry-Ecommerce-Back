const { Product, Review } = require('../../db.js');
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");

const newReview = async(req, res, next) => {
    if (!req.body.idProd || !req.body.rating) {return res.status(400).json({message: 'Bad request'})}
    try {
        const id = uuidv4()
        await Review.create({
            id,
            rating: req.body.rating,
            comment: req.body.comment,
        })
        const Prod = await Product.findByPk(req.body.idProd)
        await Prod.addReview(id)
        const User = await User.findByPk(req.cookies.id)
        await User.addReview(id)
        return res.status(200).json({message: 'Review created'})
    } catch (error){
        return res.status(500).json(error)
    }
}

const updateReview = async (req, res, next)  => {
	const {idRev} = req.body
	try{
		const rev = Review.findByPk(idRev)
		if (req.body.comment) rev.comment = req.body.comment;
		if (req.body.rating) rev.rating = req.body.rating;
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

module.exports = {
    newReview, 
    updateReview, 
    deleteReview
}
