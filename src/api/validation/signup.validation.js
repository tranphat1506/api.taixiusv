const Joi = require('joi')

const Regex = {
    email : /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    password : /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])([^\s]){8,16}$/,
    phone : /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/
}
const Message = {
    space : " ",
    required : "không được để trống!",
    min : "tối thiểu {{#limit}} ký tự!",
    max : "tối đa {{#limit}} ký tự!",
    pattern : "không hợp lệ!",
    empty : "không được để trống!",
    equal : "không trùng với mật khẩu vừa nhập!"
}
const Label = {
    display_name : "Tên hiển thị",
    user_name : "Tên tài khoản",
    password : "Mật khẩu",
    re_password : "Mật khẩu nhập lại",
    email : "Email",
    phone : "Số điện thoại"
}
const registerRule = Joi.object({
    display_name: Joi.string()
        .min(6)
        .max(24)
        .required()
        .messages({
            "string.empty" : Label.display_name + Message.space + Message.empty,
            "any.required" : Label.display_name + Message.space + Message.required,
            "string.min" : Label.display_name + Message.space + Message.min,
            "string.max" : Label.display_name + Message.space + Message.max
        }),
    email : Joi.string()
        .pattern(Regex.email)
        .messages({
            "string.empty" : Label.email + Message.space + Message.empty,
            "string.pattern.base" : Label.email + Message.space + Message.pattern
        }),
    phone : Joi.string()
        .pattern(Regex.phone)
        .messages({
            "string.pattern.base" : Label.phone + Message.space + Message.pattern,
            "string.empty" : Label.phone + Message.space + Message.empty
        }),
    user_name: Joi.string()
        .min(6)
        .max(32)
        .messages({
            "string.min" : Label.user_name + Message.space + Message.min,
            "string.empty" : Label.user_name + Message.space + Message.empty,
            "string.max" : Label.user_name + Message.space + Message.max
        }),
    password: Joi.string()
        .min(8)
        .pattern(Regex.password)
        .required()
        .messages({
            "any.required" : Label.password + Message.space + Message.required,
            "string.min" : Label.password + Message.space + Message.min,
            "string.empty" : Label.password + Message.space + Message.empty,
            "string.pattern.base" : Label.password + Message.space + Message.pattern
        }),
    re_password: Joi.string()
        .equal(Joi.ref('password'))
        .required()
        .messages({
            "any.required" : Label.re_password + Message.space + Message.required,
            "string.empty" : Label.re_password + Message.space + Message.empty,
            "any.only" : Label.re_password + Message.space + Message.equal
        }),
})
const updateEmailAndPhone = Joi.object({
    email : Joi.string()
        .pattern(Regex.email)
        .messages({
            "string.empty" : Label.email + Message.space + Message.empty,
            "string.pattern.base" : Label.email + Message.space + Message.pattern
        }),
    phone : Joi.string()
        .pattern(Regex.phone)
        .messages({
            "string.pattern.base" : Label.phone + Message.space + Message.pattern,
            "string.empty" : Label.phone + Message.space + Message.empty
        }),
})
module.exports = validation = (schema) =>{
    const { error } = registerRule.validate(schema)
    if (error) return error;
}
