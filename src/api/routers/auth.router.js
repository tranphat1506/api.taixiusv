const express = require('express');
const router = express.Router();

//controller
const authController = require('../controllers/auth.controller')

router.get('/', async (req,res)=>{
    return res.sendStatus(200);
})

// dang nhap
router.post('/signin',authController.signIn);
// dang ky
router.post('/signup',authController.signUp)
// dang xuat
router.post('/logout',authController.logOut);
module.exports = router;