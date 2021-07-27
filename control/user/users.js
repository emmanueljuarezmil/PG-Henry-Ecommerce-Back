const { User } = require('../../db.js');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios')
const { Op } = require("sequelize");
const usersDBJson = require('../../bin/data/users.json')


const exclude = ['createdAt', 'updatedAt']

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
    };
};

async function updateShippingAddress(req, res, next) {
    const { idUser } = req.params
    try {
        const user = await User.findByPk(idUser)
        user.shippingAddress = req.body.shippingAddress
        user.save()
        return res.status(200).json(user)
    } catch (error) {
        return next(error);
    };
}

async function getShippingAddress(req, res, next) {
    const { idUser } = req.params
    try {
        const address = await User.findOne({
            where: {id: idUser},
            attributes: {exclude: ['createdAt', 'updatedAt', 'name', 'userName', 'email', 'admin', 'hashedPassword']}
        })
        return res.status(200).json(address)
    } catch (error) {
        return next(error);
    }
}



// const validate = ['null', undefined, 'undefined', '']
//     if (validate.includes(name)) name = ''
//     if (validate.includes(page)) page = 1
//     if (validate.includes(orderBy)) orderBy = 'name'
//     if (validate.includes(orderType)) orderType = 'asc'
//     if (validate.includes(category)) category = ''

async function getAllUsers(req, res, next) {
    let {name, admin} = req.query
    console.log(req.query)
    if(name === 'undefined') name = ''
    if(admin === 'undefined') admin = undefined
    try {
        const user = await User.findAll({
            where: admin !== undefined ?
            {
                name: { [Op.iLike]: `%${name}%` },
                admin
            } : {
                name: { [Op.iLike]: `%${name}%` }
            },
            attributes: {
                exclude: [...exclude,'hashedPassword','shippingAddress']
            },
            order: ['name']
        });
        return res.send(user)
    } catch (error) {
        next({ message: 'Bad Request' })
    }
}

async function deleteUser(req, res, next) {
    if (!req.params.idUser) {
        return res.status(400).json({ message: 'ID of the user is needed', status: 400 })
    }
    const { idUser } = req.params;
    try {
        await User.destroy({
            where: {
                id: idUser
            }
        })
        const users = await User.findAll()
        return res.send(users)
    } catch (error) {
        next(error);
    }
}

async function newAdmin(req, res, next) {
    let { id, value } = req.body
    value = JSON.parse(value)
    if (!id) return next({ message: 'El id del nuevo admin es necesario' })
    try {
        const user = await User.findByPk(id)
        if (!user) return res.send({message: 'El usuario no fue encontrado'})
        if(user.admin === value) return res.send({message: 'El usuario ya tiene esta credencial'})
        user.admin = value;
        user.save();
        return value === true ? res.send('Usuario elevado a admin') : res.send('Usuario dejo de ser admin')
    } catch (error) {
        next(error)
    }
}



async function loginUser(req, res, next) {
    const {email, username, hashedpassword, name} = req.headers
    if(username) {
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
              hashedPassword: hashedpassword,
              name
            })
            await axios(`http://localhost:3000/user/sendmail?type=welcome`,{
                headers: {
                    name: username,
                    email
                }
            })
            return res.send(newUser)
          }
          else return res.send(isUser)
        } catch(err) {
          next(err)
        }
      }
}

async function fullDbUsers() {
    for (let i of usersDBJson) {
        try {
            var id = uuidv4();
            i.id = id
            await User.create(i);
        } catch (error) {
            console.error(error);
            next(error);
        }
    }
}

module.exports = {
    updateUser,
    getAllUsers,
    deleteUser,
    newAdmin,
    loginUser,
    fullDbUsers,
    updateShippingAddress,
    getShippingAddress,
}