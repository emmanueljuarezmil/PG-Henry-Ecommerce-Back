const { Router } = require('express');
const {getAllUsers, newUser, updateUser, deleteUser} = require('../../control/user/users.js') 
const {userPasswordReset} = require('../../control/admin/auth/auth.js')



const router = Router();


router.get('/users', getAllUsers);
router.post('/users/register', newUser);
// router.post('/users/:idUser/passwordreset', userPasswordReset);
router.put('/users/:idUser', updateUser);
router.delete('/users/:idUser', deleteUser);


module.exports = router;