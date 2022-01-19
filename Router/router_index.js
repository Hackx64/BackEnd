const Register = require('../Controller/register');
const Login = require('../Controller/login');

const express=require("express");
const bcrypt = require('bcrypt-nodejs');
const jwt = require ('jsonwebtoken');
const nodemailer = require('nodemailer');


const router=express.Router();

router.get('/',(req,res)=>{
    res.status(200).json({message:"Success"});
});
router.use('/admin',require("./router_admin"));   //Routing admin routes to router_admin.js


//the register functionality 
router.post('/register',(req,res)=>{
    Register.register(req,res,nodemailer,jwt)
});
router.get('/authentication/:token',(req,res)=>{
    Register.verify(req,res,bcrypt,jwt)
});

//For login
router.post('/login',(req,res)=>{
    Login.login(req,res,bcrypt,jwt)
});
router.get('/verifytoken/:token',(req,res)=>{
    Login.getuser(req,res,jwt)
});


module.exports=router;
