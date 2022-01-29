const Register = require('../Controller/register');
const Login = require('../Controller/login');
const Payment = require('../Controller/payment');
const Application = require ('../Controller/hostel_application');
const GetData = require('../Controller/get_data');
const Query = require ('../Controller/query');
const BookGuestHouse = require ('../Controller/book_guest_house');

const express=require("express");
const bcrypt = require('bcrypt-nodejs');
const jwt = require ('jsonwebtoken');
const nodemailer = require('nodemailer');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const Middlewares = require('../Utils/middlewares');

const router=express.Router();
//router.use(Middlewares.extractFromToken);

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

//for Booking a hostel
router.post ('/application',Middlewares.checkUserAuthentication, (req, res) => {
    Application.sendApplication(req, res);
});
//For sending a room change application
router.post ('/roomchange/application',Middlewares.checkUserAuthentication, (req, res) => {
    Application.roomchangeapplication(req, res);
}); 

//Getting hostel/room id for a particular student
router.get ('/getHostel', Middlewares.checkUserAuthentication,(req, res) => {
    Application.getHostel (res, res);    
});

//payment
router.post('/pay/detail',Middlewares.checkUserAuthentication,Payment.findPaymentAmount);
router.post('/pay', Middlewares.checkUserAuthentication,(req, res) => {
    Payment.makePayment(req,res,stripe);
});

//query service
router.post ('/query', Middlewares.checkUserAuthentication,(req, res) => {
    Query.queryService(req,res);
});

//canteen
router.post('/canteens',Middlewares.checkUserAuthentication,GetData.getCanteen);

//Address of hostel
router.get('/hostel/address',GetData.findPositionLink);

//to book a guest house
router.post ('/getGuestHouse', (req, res) => {
    BookGuestHouse.getGuestHouse (req, res);
});

// For completing profile
router.post('/update/user',(req,res)=>{Register.update(req,res)}) ;

//For fetching application status
router.post('/application/status/user',Middlewares.checkUserAuthentication , (req,res)=>{
  Application.getApplication(req,res);
});

module.exports=router;
