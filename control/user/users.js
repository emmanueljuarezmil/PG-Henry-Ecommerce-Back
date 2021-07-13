const {User} = require('../../db.js');
const { v4: uuidv4 } = require('uuid');
const { Op } = require("sequelize");
const { userInfo } = require('node:os');

const newUser = async (req, res, next) => {
    if (!req.body.userName || !req.body.email || !req.body.hashPassword) {
        return res.status(400).json({message: 'Bad request'})
    }
    const {email, userName, hashPassword} = req.body
    try {
        const exist = await User.findOne({where: {email: email}})
        if (exist !== null) {return res.status(500).json({message: 'The email already exist'})}
        const exist2 = await User.findOne({where: {userName: userName}})
        if (exist2 !== null) {return res.status(500).json({message: 'The user already exist'})}
        const id = uuidv4()
        const user = {id, userName, hashPassword, email}
        await User.create(user)
        return res.redirect('./')
    } catch(error){
        return res.status(500).json({message: 'Error with DB'})
    }
}

const updateUser = async (req, res, next) => {
    const {userName} = req.body
    try {
        const user = User.findOne({where : {userName: userName}})
        req.body.name ? user.name = req.body.name : ''
        user.save()
        next()
    } catch (error){
        return res.status(500).json({message: 'Error with DB'})
    }  
}

const getAllUsers = async (req,res,next) => {
    try{
        const user = await User.findAll();
        return res.status(200).json(user)
    } catch(error){
        return res.status(400).json({message: 'Bad Request'})
    }
}

const deleteUser = async (req,res,next) => {
    if (!req.body.id){
        return res.status(400).json({message: 'ID of the user is needed', status:400})
    }
    const {id} = req.body;
    try{
        await User.destroy({
            where: {
                id: id
            }
        })
        return res.status(200).send('the user was succesfully deleted')
    } catch(error) {
        next(error);
    }
}

const newAdmin = async (req,res,next) => {
    if (!req.body.id) {return res.status(400).json({message: 'Bad Request'})}
    try {
        const {id} = reque.body
        const user = await User.findByPk(id)
        user.admin = true;
        user.save();
        res.redirect('/users')
    } catch(error){
        return res.status(500).json({message: 'Internal Error DB'})
    }
}

module.exports = {
    newUser,
    updateUser,
    getAllUsers,
    deleteUser
}