
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
app.use(cors());

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

        const numberUsers = await Users.countDocuments({})
        console.log(numberUsers)
        const EmployeeID =  "S" + (numberUsers+1).toString().padStart(6, '0') 

        let isAdmin = false

        if (numberUsers== 0) {            
            isAdmin = true;

        }


        let user = await Users.findOne({username})


        if(user) return res.status(401).json({"msg":"Username already exists"})
        const passwordHash = await bcrypt.hash(password, 10)
        user = new Users({EmployeeID,username,email,password:passwordHash,isAdmin})
        user.save()

        const token = await jwt.sign({id:user._id,user:username},process.env.JWT_SECRET,{expiresIn:"1h"})
        res.status(200).json({id:user._id,token})
    }
    catch(err){console.log(err)}
})

app.post("/api/createTicket", async (req,res)=>{
    const {title, author, assigned, description} = req.body
    
    const creationDate = new Date().toString()
    const resolutionDate = ""
    const status = "New"
    const logs = []

    try{
        
        let ticket = new Tickets({title, author, creationDate, resolutionDate, assigned, status, description, logs})
        console.log(ticket)
        ticket.save()

        const token = await jwt.sign({id:ticket._id},process.env.JWT_SECRET,{expiresIn:"1h"})
        res.status(200).json({id:ticket._id,token})
    }
    catch(err){console.log(err)}    
})

app.get("/api/allUsers", async (req,res)=>{

    try{
        const users = await Users.find({})
        console.log(users)
        return res.status(200).json(users)
    }
    catch(err){console.log(err)}   
})

app.get("/api/allTickets", async (req,res)=>{

    try{
        const tickets = await Tickets.find({})
        console.log(tickets)
        return res.status(200).json(tickets.reverse())
     }
    catch(err){console.log(err)}   

})

app.get("/api/users/:userID", async (req,res)=>{

    try{
        const userID = req.params.userID
        const user = await Users.findOne({_id:userID})
        console.log(user)
        return res.status(200).json({"userData":JSON.stringify(user)})
    }
    catch(err){console.log(err)}   
})

app.get("/api/view/:ticketID", async (req,res)=>{

    try {
        const ticketID = req.params.ticketID
        const ticket = await Tickets.findOne({_id:ticketID})
        return res.status(200).json({"ticketData":JSON.stringify(ticket)})
    }   
    catch(err){console.log(err)}
})

app.patch("/api/update/:ticketID", async (req, res) => {
    try {
        const ticketID = req.params.ticketID;
        const updateFields = req.body;
        console.log(updateFields)
        const updatedItem = await Tickets.findByIdAndUpdate(
            ticketID,
            {$set: updateFields},
            { new: true, runValidators: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json(updatedItem);
    }
    catch(err){console.log(err)}
});


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