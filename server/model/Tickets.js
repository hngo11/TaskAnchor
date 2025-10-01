const mongoose = require("mongoose")

const ticketSchema = mongoose.Schema({

    title: { 
        type:String,
        required:true
    },
    author: { 
        type:String,
        required:true
    },
    date: { 
        type:String,
        required:true
    },
    assigned:{
        type:String,
        required:true
    },
    status: { 
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
     logs:{
        type:Array,
        required:true
    },
})

const Tickets = mongoose.model('Tickets',ticketSchema)
module.exports = Tickets