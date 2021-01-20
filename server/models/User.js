const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const e = require('express');
const jwt = require('jsonwebtoken');
const saltRounds = 10; // 10글자로 생성


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

// 저장 전 비밀번호 암호화
userSchema.pre('save', function (next){

    var user = this;

    // 암호 변경시에만 암호화
    if(user.isModified('password')) {
        // 암호화 작업 bcrypt 사용
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
        
            // hash : 암호화된 비밀번호
            bcrypt.hash(user.password, salt, function(err, hash){
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else{
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){

    // plainPassword 와 암호화된 비밀번호가 맞는지 확인
     bcrypt.compare(plainPassword, this.password, function(err, isMatch){
         if(err) return cb(err)
         cb(null, isMatch);
     })
}

userSchema.methods.generateToken = function(cb){

    var user = this;

    //jsonwebtoken을 이용하여 token 생성
    //token = user._id + 'secretToken'
    var token  = jwt.sign(user._id.toHexString(), 'secretToken')
    user.token = token
    user.save(function(err, user){
        if(err) return cb(err)
        cb(null, user)
    })
    
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;

    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded){

        //유저 아이디를 이용해서 유저를 찾은 다음에
        //클라이언트에서 가져온 token과 DB에 보관됨 token이 일치하는지 확인
        user.findOne({"_id" : decoded, "token" : token}, function(err, user){
            if(err) return cb(err);
            cb(null, user);
        })

    })
}

const User = mongoose.model('User', userSchema)

module.exports = {User} // 다른 곳에서도 사용 가능하도록 모듈화
