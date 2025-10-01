const mongoose = require("mongoose")

const usersSchema = mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
})

const Users = mongoose.model('Users',usersSchema)
module.exports = Users