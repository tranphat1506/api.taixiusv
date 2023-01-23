const User = require('mongoose');
const UserSchema = new User.Schema({
    id : String,
    user_name : String,
    display_name : String,
    password : String,
    phone_number : {type : String, default : null},
    email : {type : String, default : null},
    is_verify : {
        phone_number : { type : Boolean, default : false},
        email : { type : Boolean, default : false}
    },
    avatar_url : { type : String , default : 'https://cdn141.picsart.com/357697367045201.jpg'},
    created_at : { type : String, default : new Date().toString()}
})
const UserModel = User.model('Users',UserSchema);
module.exports = {
    UserModel
}