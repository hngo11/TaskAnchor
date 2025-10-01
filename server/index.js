
const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const Users = require("./model/Users")
const Tickets = require("./model/Tickets")

dotenv.config()
const app = express()
app.use(express.json({limit:'5mb'}))
app.use(cors())

app.post("/api/auth/login", async (req,res)=>{
    const {username, password} = req.body

    try{
        let user = await Users.findOne({username})
        if(!user) return res.status(401).json({"msg":"Wrong username or password"})

        const passwdTest = await bcrypt.compare(password,user.password)
        if (!passwdTest) return res.status(401).json({"msg":"Wrong username or password"})
        
        const token = await jwt.sign({id:user._id,user:username},process.env.JWT_SECRET,{expiresIn:"1h"})
        res.status(200).json({id:user._id,token})
    }
    catch(err){console.log(err)}    
})

app.post("/api/auth/register", async (req,res)=>{
    try{
        const {username, email, password} = req.body
        let user = await Users.findOne({username})

        if(user) return res.status(401).json({"msg":"Username already exists"})
        const passwordHash = await bcrypt.hash(password, 10)
        user = new Users({username,email,password:passwordHash})
        user.save()

        const token = await jwt.sign({id:user._id,user:username},process.env.JWT_SECRET,{expiresIn:"1h"})
        res.status(200).json({id:user._id,token})
    }
    catch(err){console.log(err)}
})

app.post("/api/createTicket", async (req,res)=>{
    const {title, author, date, assigned, status, description, logs} = req.body
    
    try{

        let ticket = new Tickets({title, author, date, assigned, status, description, logs})
        console.log(ticket)
        ticket.save()

        const token = await jwt.sign({id:ticket._id},process.env.JWT_SECRET,{expiresIn:"1h"})
        res.status(200).json({id:ticket._id,token})
    }
    catch(err){console.log(err)}    
})

async function serverStart(){
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        app.listen(process.env.PORT,()=>{
            console.log('Server has started')
        })
    }
    catch(err){console.log(err)}
}

serverStart()