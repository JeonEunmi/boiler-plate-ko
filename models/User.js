const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type : String,
        maxlength: 50
    },
    email: {
        type : String,
        trim : true, //공백제거
        unique : 1
    },
    password : {
        type : String,
        minlength : 8
    },
    lastname : {
        type : String,
        maxlength : 50
    },
    role : {
        type : Number,
        default : 0
    },
    image :  String,
    token : {
        type : String
    },
    tokenExp :  {
        type : Number
    }
})

const User = mongoose.model('User', userSchema)

module.exports = {User} // 다른 곳에서도 사용 가능하도록 모듈화