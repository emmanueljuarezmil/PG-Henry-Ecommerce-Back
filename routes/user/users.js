const { Router } = require('express');
const { getAllUsers, updateUser, deleteUser, newAdmin, loginUser } = require('../../control/user/users.js')
const {checkJwt, isAdmin, isAuth} = require('../../control/auth/index.js')

const router = Router();

router.get('/users', checkJwt, isAdmin, getAllUsers);
router.get('/users/login',checkJwt, loginUser);
router.put('/users/newadmin', checkJwt, isAdmin, newAdmin)
router.put('/users/newadminforpostman', newAdmin) // ruta sin control para crear admin desde postman o desde telegrafo
router.put('/users/:idUser', checkJwt, isAuth, updateUser); // updatear cuando integremos auth0
router.delete('/users/:idUser', checkJwt, isAuth, deleteUser); // updatear cuando integremos auth0

module.exports = router;