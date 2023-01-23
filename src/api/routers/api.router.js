/* *
 * 
 * INIT ROUTER
 *  
 * */
const express = require('express');
const router = express.Router();

/* *
 * 
 * LIBRARIES & VARIABLES
 * 
 * */
/* *
 * 
 * MIDDLEWARES & CONTROLLERS
 * 
 * */ 

/* *
 * 
 * SPLIT ROUTER
 * 
 * */
//
const taixiuRouter = require('./taixiu.router');
const authRouter = require('./auth.router');
const authMiddleware = require('../middlewares/auth.middleware')
// MAIN ENDPOINT
router.use((req,res, next)=>{
    // prevent CORS send pre-flight
    if (req.method == "OPTIONS"){
        return res.sendStatus(200)
    }
    return next();
})
router.use('/auth',authRouter);
router.use(authMiddleware.verifyToken);
router.use('/taixiu',taixiuRouter);
router.get('/', async (req,res) => {
    return res.sendStatus(200);
});

router.get('/test/setToken',(req,res)=>{
    const token = Date.now()
    res.setHeader('Authorization',`Bearer ${token}`)
    return res.sendStatus(200)
})
router.get('/test/getToken',(req,res)=>{
    const [scheme, token] = req.headers.authorization.split(' ')
    console.log(scheme, token);
    return res.sendStatus(200)
})
module.exports = router;
