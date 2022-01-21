const express = require("express");
const Authentication = require("../Controller/admin/auth_admin");
const AddController = require("../Controller/admin/add_admin");
const multer = require ('multer');
const upload = multer ({dest : 'Uploads/'});

const router = express.Router();
const bcrypt = require('bcrypt-nodejs');
const jwt=require("jsonwebtoken");
const Middlewares = require('../Utils/middlewares'); 


router.use(Middlewares.extractFromToken);

router.post('/register',upload.single ('image'), (req,res)=>{
    Authentication.register(req,res,bcrypt);
});

//For login
router.post('/login',(req,res)=>{
    Authentication.login(req,res,bcrypt,jwt);
});
router.get('/verifytoken/:token',(req,res)=>{
    Authentication.getAdmin(req,res,jwt);
});


//Add Institute
router.post('/add/institute',Middlewares.checkAdmin,(req,res)=>{
    AddController.addInstitute(req,res);
});

//Add Hostel
router.post('/add/hostel',Middlewares.checkAdmin,(req,res)=>{
    AddController.addHostel(req,res);
});

//Add Room
router.post('/add/room',Middlewares.checkAdmin,(req,res)=>{
    AddController.addRoom(req,res);
});




module.exports=router;