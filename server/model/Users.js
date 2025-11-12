const mongoose = require("mongoose")

const usersSchema = mongoose.Schema({
    
    EmployeeID:{
        type:String,
        required:true,
        unique:true
    },
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
    isAdmin:{
        type:Boolean,
        required:true
    },
})

const Users = mongoose.model('Users',usersSchema)
module.exports = Users