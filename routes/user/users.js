const { Router } = require('express');
const { getAllUsers, newUser, updateUser, deleteUser, newAdmin, loginUser } = require('../../control/user/users.js')
const {isAdmin, isAuth, captureUser} = require('../../control/auth')

const router = Router();

router.get('/users', getAllUsers);
// router.post('/users/register', newUser);
router.get('/users/login', loginUser);
router.put('/users/newadmin', newAdmin)
router.put('/users/newadminnotauth', newAdmin)
router.put('/users/:idUser', updateUser);
router.delete('/users/:idUser', deleteUser);

module.exports = router;