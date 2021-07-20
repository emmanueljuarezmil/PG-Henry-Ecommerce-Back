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

module.exports = {
    newReview, 
    updateReview, 
    deleteReview
}