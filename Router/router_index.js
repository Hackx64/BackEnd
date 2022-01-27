const Register = require('../Controller/register');
const Login = require('../Controller/login');
const Payment = require('../Controller/payment');
const Application = require ('../Controller/hostel_application');
const GetData = require('../Controller/get_data');

const express=require("express");
const bcrypt = require('bcrypt-nodejs');
const jwt = require ('jsonwebtoken');
const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const Feedback = require ('../Controller/feedback');
const BookGuestHouse = require ('../Controller/book_guest_house');
const Middlewares = require('../Utils/middlewares');

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
router.post ('/application',Middlewares.checkUserAuthentication, (req, res) => {
    Application.sendApplication (req, res);
})  

//Booking hostel
router.get ('/getHostel', Middlewares.checkUserAuthentication,(req, res) => {
    Application.getHostel (res, res);    
})

//payment
router.post('/pay', Middlewares.checkUserAuthentication,(req, res) => {
    Payment.makePayment(req,res,stripe);
});

//feedback service
router.post ('/feedback', Middlewares.checkUserAuthentication,(req, res) => {
    Feedback.feedbackService(req, res);
});

//canteen
router.get('/canteens',Middlewares.checkUserAuthentication,GetData.getCanteen);

//to book a guest house
router.post ('/getGuestHouse', (req, res) => {
    BookGuestHouse.getGuestHouse (res, res);
})


module.exports=router;
