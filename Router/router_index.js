const Register = require('../Controller/register');
const Login = require('../Controller/login');
const Payment = require('../Controller/payment');
const SendApplication = require ('../Controller/hostel_application');
const express=require("express");
const bcrypt = require('bcrypt-nodejs');
const jwt = require ('jsonwebtoken');
const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);


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

//for booking a hostel
router.post ('/application', (req, res) => {
    SendApplication.sendApplication (req, res);
})


//payment

router.post('/pay', (req, res) => {
    Payment.makePayment(req,res,stripe);
});


module.exports=router;
