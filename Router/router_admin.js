const express = require("express");
const router = express.Router();
const Authentication = require("../Controller/admin/auth_admin");
const AddController = require("../Controller/admin/add_admin");
const FindController = require("../Controller/admin/find_admin");
const ApplicationController =require("../Controller/admin/appliations_admin");

const multer = require ('multer');
const upload = multer ({dest : 'Uploads/'});
const bcrypt = require('bcrypt-nodejs');
const jwt=require("jsonwebtoken");
const Middlewares = require('../Utils/middlewares'); 


router.use(Middlewares.extractFromToken);

router.post('/register',upload.single ('file'), (req,res)=>{
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
router.post('/add/institute',Middlewares.checkAdmin,AddController.addInstitute);

//Add Hostel
router.post('/add/hostel',Middlewares.checkAdmin,AddController.addHostel);

//Add Room
router.post('/add/room',Middlewares.checkAdmin,AddController.addRoom);

//Find Rooms
router.get('/rooms/all',Middlewares.checkAdmin,FindController.findAllRooms);
router.get('/rooms/free',Middlewares.checkAdmin,FindController.findAllFreeRooms);


//Find occupied room
router.get('/rooms/occupied',FindController.findOccupiedRooms);

//Find all hostels of a College
router.post('/hostels/all',Middlewares.checkAdmin,FindController.findAllHostel) ;

//Applications
router.get('/application/findApplications',ApplicationController.findAllApplocations);
router.get('/application/accept',ApplicationController.accept);
router.get('/application/reject',ApplicationController.reject);



module.exports=router;