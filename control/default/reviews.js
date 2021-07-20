const { Product, Review } = require('../../db.js');
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");



module.exports = {
    newReview, 
    updateReview, 
    deleteReview
}