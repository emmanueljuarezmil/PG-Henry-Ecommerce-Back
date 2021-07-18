const { Router } = require('express');
const { getAllUsers, newUser, updateUser, deleteUser, newAdmin, loginUser } = require('../../control/user/users.js')
const { userPasswordReset } = require('../../control/admin/auth/auth.js')
const {isAdmin, isAuth} = require('../../control/auth')



const router = Router();


router.get('/users', isAuth, isAdmin, getAllUsers);
router.post('/users/register', newUser);
router.post('/users/login', loginUser);
router.put('/users/newadmin', isAuth, isAdmin, newAdmin)
router.put('/users/newadminnotauth', newAdmin)
router.put('/users/:idUser', isAuth, updateUser);
router.delete('/users/:idUser', isAuth, isAdmin, deleteUser);



module.exports = router;