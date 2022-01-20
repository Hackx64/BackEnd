var express = require("express")
var app = express() ;
var dotenv = require('dotenv') ;
dotenv.config();
const mongoose = require('./Models/config');
const cors = require('cors');
const nodemailer=require("./Utils/nodemailer");


app.use(express.urlencoded({extended:true}));

//Starting middleware
app.use(express.json()) ;
app.use(cors()) ;
app.use('/',require('./Router/router_index'));
//End of middlewares



app.listen(process.env.PORT || 5000 , (err)=> {
    if(err){
        console.log("Error in setting up server!");
        return;
    }
    console.log("Server running!");
})


