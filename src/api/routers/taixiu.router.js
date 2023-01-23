const express = require('express');
const router = express.Router();
const taixiuMiddleware = require('../middlewares/taixiu.middleware')
const taixiuController = require('../controllers/taixiu.controller');

//router.use(taixiuMiddleware.checkCurrentSession);
router.get('/get-info', taixiuController.getInfo);
router.get('/get-session-id',taixiuController.getNewSession);
router.get('/get-history',taixiuController.getHistory);
router.post('/bet',taixiuController.betEvent)
router.options('/',(req,res)=>{
    return res.sendStatus(200);
})
module.exports = router;