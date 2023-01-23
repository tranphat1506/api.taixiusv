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
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

const cors = require('cors')
router.use((req,res, next)=>{
    // prevent CORS send pre-flight
    if (req.method == "OPTIONS"){
        return res.sendStatus(200)
    }
    return next();
})
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'POST, GET, DELETE, PUT, PATCH');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    return next();
};

const helmet = require('helmet')
router.use(helmet())
/* const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
    allowCrossDomain : true
 } */
router.use(allowCrossDomain)
var cookieParser = require('cookie-parser')
router.use(cookieParser())

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


// API ROUTER
const API = require('./api.router');
router.use('/api', API);

module.exports = router;
