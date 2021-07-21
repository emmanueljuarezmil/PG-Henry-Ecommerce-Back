const { User } = require('../../db.js');
const { v4: uuidv4 } = require('uuid');

async function newUser(req, res, next) {
    if (!req.headers.userName || !req.headers.email || !req.headers.hashedPassword) {
        return res.status(400).json({ message: 'Bad request' })
    }
    const { email, userName, hashedPassword } = req.headers
    try {
        // const existAuth0 = await User.findOne({ where: { email, userName, hashedPassword } })
        // if(existAuth0) return res.send(existAuth0)
        const exist = await User.findOne({ where: { email: email } })
        if (exist !== null) { return res.status(500).send({ message: 'El email ya existe.' }) }
        const exist2 = await User.findOne({ where: { userName: userName } })
        if (exist2 !== null) { return res.status(500).json({ message: 'El nombre de usuario ya existe.' }) }
        const id = uuidv4()
        const user = { id, userName, hashedPassword, email }
        await User.create(user)
        return res.send(user)
    } catch (error) {
        return res.status(500).json({ message: 'Error with DB' })
    }
}

async function updateUser(req, res, next) {
    const { idUser } = req.headers
    try {
        const user = User.findByPk(idUser)
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
    if (!req.headers.idUser) {
        return res.status(400).json({ message: 'ID of the user is needed', status: 400 })
    }
    const { idUser } = req.headers;
    try {
        await User.destroy({
            where: {
                id: idUser
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
        return res.send('Usuario elevado a admin')
    } catch (error) {
        return res.status(500).json({ message: 'Internal Error DB' })
    }
}

async function loginUser(req, res, next) {
    console.log(req.headers)
    if(req.headers.username) {
        const {email, username, hashedpassword} = req.headers
        try {
          const isUser = await User.findOne({
            where: {
              email
            }
          })
          if (!isUser) {
            const id = uuidv4()
            const newUser = await User.create({
              id,
              email,
              userName: username,
              hashedPassword: hashedpassword
            })
            return res.send(newUser)
          }
          else return res.send(isUser)
        } catch(err) {
          console.error(err)
        }
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
