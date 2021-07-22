const { Router } = require('express');
const { getAllUsers, updateUser, deleteUser, newAdmin, loginUser } = require('../../control/user/users.js')
const {isAdmin, isAuth, captureUser} = require('../../control/auth')

const router = Router();

router.get('/users', getAllUsers);
router.get('/users/login', loginUser);
router.put('/users/newadmin', newAdmin)
router.put('/users/newadminforpostman', newAdmin) // ruta sin control para crear admin desde postman o desde telegrafo
router.put('/users/:idUser', updateUser); // updatear cuando integremos auth0
router.delete('/users/:idUser', deleteUser); // updatear cuando integremos auth0

module.exports = router;