const jwtHelper = require('../helpers/jwt.helper')
const _ = require('underscore');
const {TaixiuModel} = require("../models/taixiu.model")
const User = require('../models/users.model');
const signupValidation = require('../validation/signup.validation');
const {v4 : uuidv4} = require('uuid')
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 123
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 234
const ACCESS_TOKEN_LIFE = process.env.ACCESS_TOKEN_LIFE || "1m"
const REFRESH_TOKEN_LIFE = process.env.REFRESH_TOKEN_LIFE || "1h"

const bcrypt = require('bcrypt');
const saltRounds = 8;
//dang nhap
async function signIn(req,res){
    const {user_name, password} = req.body;
    try {
        User.UserModel.findOne({ user_name })
            .then(async (user)=>{
                if (_.isNull(user)){
                    // neu khong tim thay nguoi dung
                    return res.status(400).json({
                        message : 'Tài khoản hoặc mật khẩu không hợp lệ!'
                    })
                }
                bcrypt.compare(password, user.password)
                .then((result)=>{
                    // neu mat khau khong khop
                    if (!result){
                        return res.status(400).json({
                            message : 'Tài khoản hoặc mật khẩu không hợp lệ!'
                        })
                    }
                    // neu khop
                    Promise.all([
                        jwtHelper.generateToken(user, ACCESS_TOKEN_SECRET, ACCESS_TOKEN_LIFE), 
                        jwtHelper.generateToken(user, REFRESH_TOKEN_SECRET, REFRESH_TOKEN_LIFE)
                    ])
                    .then(async arrayToken=>{
                        await res.cookie('a_token', arrayToken[0].encoded, {
                            maxAge : 3600000, //milli secs
                            domain : 'localhost',
                            sameSite: 'lax',
                            httpOnly : true,
                            //secure : true
                        })
                        await res.cookie('r_token', arrayToken[1].encoded, {
                            maxAge : 3153600000, //millisecs
                            domain : 'localhost',
                            sameSite: 'lax',
                            httpOnly : true,
                            //secure : true
                        })
                        return res.sendStatus(200); 
                    })
                })
            })
            .catch(err=>{
                console.log(err);
                return res.status(500).json({
                    message : 'Hệ thống đang bận!'
                });
            })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : 'Hệ thống đang bận!'
        });
    }
}
//dang ky
async function signUp(req,res){
    const {display_name, phone, email, user_name, password, re_password} = req.body;
    
    const validation = signupValidation({
        display_name,
        user_name,
        password,
        re_password
    });
    if (validation){ 
        /* return res.status(400).json({
            status : '400',
            message : validation.message
        }); */
        return res.status(400).json({
            message : validation.message
        });
    }
    try {
        bcrypt.hash(password, saltRounds)
        .then((hash)=>{
            User.UserModel.findOne({ user_name })
            .then(async (user)=>{
                // neu tai khoan chua ton tai
                if (_.isNull(user)){
                    const id = await uuidv4();
                    const newUser = new User.UserModel({
                        id,
                        user_name,
                        password : hash
                    })
                    const newTaixiuProfile = new TaixiuModel({
                        id,
                        money : 10000
                    })
                    await newTaixiuProfile.save();
                    await newUser.save();
                    return res.status(200).json({
                        message : 'Đăng ký thành công!'
                    })
                }
                return res.status(400).json({
                    message : 'Người dùng đã tồn tại!'
                })
            })
            .catch(err=>{
                console.log(err);
                return res.status(500).json({
                    message : 'Hệ thống đang bận!'
                });
            })
        })
        .catch(err=>{
            console.log(err);
            return res.status(500).json({
                message : 'Hệ thống đang bận!'
            });
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : 'Hệ thống đang bận!'
        });
    }
}
//dang xuat
async function logOut(req,res){
}
module.exports = {
    signIn,
    signUp,
    logOut
}