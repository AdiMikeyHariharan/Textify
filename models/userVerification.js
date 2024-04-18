const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserVerificationSchema = new Schema({
    userId:{
        type:String,
        required:true,
        unique:true
    },
    uniqueString:{
        type:String,
        required:true,
        unique:true
    },
    createdAt:{
        type:Date
    },
    expiresAt:{
        type:Date
    }
})

const UserVerification = mongoose.model(
    "UserVerification",
    UserVerificationSchema
)
module.exports = UserVerification