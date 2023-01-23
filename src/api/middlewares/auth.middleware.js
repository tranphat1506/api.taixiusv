const _ = require('underscore')
const User = require('../models/users.model');
const jwtHelper = require('../helpers/jwt.helper')
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 123
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 234
const ACCESS_TOKEN_LIFE = process.env.ACCESS_TOKEN_LIFE || "1m"
const REFRESH_TOKEN_LIFE = process.env.REFRESH_TOKEN_LIFE || "1h"

async function verifyToken(req, res, next) {
    const accessToken = req.cookies.a_token;
    const refreshToken = req.cookies.r_token;
    try {
        if (refreshToken){
            /* if (!accessToken){
                const {decoded} = await jwtHelper.verifyToken(refreshToken, REFRESH_TOKEN_SECRET)
                Promise.all([
                    jwtHelper.generateToken(decoded, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE), 
                    jwtHelper.generateToken(decoded, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE)
                ])
                .then(async arrayToken=>{
                    res.cookie('a_token', arrayToken[0].encoded, {
                        maxAge : 3600000, //millisecs
                        domain : 'localhost',
                        sameSite: 'none',
                        httpOnly : true
                    })
                    res.cookie('r_token', arrayToken[1].encoded, {
                        maxAge : 31536000000, //millisecs
                        domain : 'localhost',
                        sameSite: 'none',
                        httpOnly : true
                    })
                    return next();
                })
                return ;
            } */
            jwtHelper.verifyToken(accessToken, ACCESS_TOKEN_SECRET)
            // neu access token con thoi han
            .then((resolve)=>{
                return next();
            })
            // neu access token het thoi han || error
            .catch(async (reject)=>{
                //console.log(reject);
                const {decoded} = await jwtHelper.verifyToken(refreshToken, REFRESH_TOKEN_SECRET)
                Promise.all([
                    jwtHelper.generateToken(decoded.data, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE), 
                    jwtHelper.generateToken(decoded.data, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE)
                ])
                .then(async arrayToken=>{
                    res.cookie('a_token', arrayToken[0].encoded, {
                        maxAge : 3600000, //millisecs
                        sameSite: 'Lax',
                        domain : "https://api-taixiusv.onrender.com",
                        path : "/api",
                        httpOnly : true,
                        secure : true
                    })
                    res.cookie('r_token', arrayToken[1].encoded, {
                        maxAge : 31536000000, //millisecs
                        sameSite: 'Lax',
                        domain : "https://api-taixiusv.onrender.com",
                        path : "/api",
                        httpOnly : true,
                        secure : true
                    })
                    return next();
                })
            })
        }
        else{
            // if none provide token
            return res.sendStatus(401);
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : 'Hệ thống đang bận!'
        });
    }
}

module.exports = {
    verifyToken
}