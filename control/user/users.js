const { User } = require('../../db.js');
const { v4: uuidv4 } = require('uuid');

async function newUser(req, res, next) {
    if (!req.body.userName || !req.body.email || !req.body.hashedPassword) {
        return res.status(400).json({ message: 'Bad request' })
    }
    const { email, userName, hashedPassword } = req.body
    try {
        const exist = await User.findOne({ where: { email: email } })
        if (exist !== null) { return res.status(500).json({ message: 'The email already exist' }) }
        const exist2 = await User.findOne({ where: { userName: userName } })
        if (exist2 !== null) { return res.status(500).json({ message: 'The user already exist' }) }
        const id = uuidv4()
        const user = { id, userName, hashedPassword, email }
        await User.create(user)
        return res.send(user)
    } catch (error) {
        return res.status(500).json({ message: 'Error with DB' })
    }
}

async function updateUser(req, res, next) {
    const { userName } = req.body
    try {
        const user = User.findOne({ where: { userName: userName } })
        req.body.name ? user.name = req.body.name : ''
        user.save()
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: 'Error with DB' })
    }
}

async function getAllUsers(req, res, next) {
    try {
        const user = await User.findAll();
        return res.status(200).json(user)
    } catch (error) {
        return res.status(400).json({ message: 'Bad Request' })
    }
}

async function deleteUser(req, res, next) {
    if (!req.body.id) {
        return res.status(400).json({ message: 'ID of the user is needed', status: 400 })
    }
    const { id } = req.body;
    try {
        await User.destroy({
            where: {
                id: id
            }
        })
        return res.status(200).send('the user was succesfully deleted')
    } catch (error) {
        next(error);
    }
}

async function newAdmin(req, res, next) {
    if (!req.body.id) { return res.status(400).json({ message: 'Bad Request' }) }
    try {
        const { id } = req.body
        const user = await User.findByPk(id)
        user.admin = true;
        user.save();
        res.redirect('/users')
    } catch (error) {
        return res.status(500).json({ message: 'Internal Error DB' })
    }
}

async function loginUser(req, res, next) {
    if (!req.body.email || !req.body.hashedPassword) { return res.status(400).json({ message: 'Bad Request' }) }
    try {
        const { email, hashedPassword } = req.body
        const user = await User.findOne({
            where: {
                email,
                hashedPassword
            }
        })
        return res.send(user)
    } catch (error) {
        return res.status(500).json({ message: 'Internal Error DB' })
    }
}

module.exports = {
    newUser,
    updateUser,
    getAllUsers,
    deleteUser,
    newAdmin,
    loginUser
}
