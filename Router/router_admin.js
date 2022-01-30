const express = require("express");
const router = express.Router();
const Authentication = require("../Controller/admin/auth_admin");
const AddController = require("../Controller/admin/add_admin");
const FindController = require("../Controller/admin/find_admin");
const ApplicationController =require("../Controller/admin/appliations_admin");
const QueryController = require("../Controller/admin/query_admin");
const Guest = require ('../Controller/admin/add_guest_house');
const multer = require ('multer');
const upload = multer ({dest : 'Uploads/'});
const bcrypt = require('bcrypt-nodejs');
const jwt=require("jsonwebtoken");
const Middlewares = require('../Utils/middlewares'); 


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

//Add Canteen
router.post('/add/canteen',AddController.addCanteen);

//Add Guest House
router.post ('/add/guesthouse', (req, res) => {Guest.addGuestHouse (req, res)});

//Find Rooms
router.post('/rooms/all',Middlewares.checkAdmin,FindController.findAllRooms);
router.post('/rooms/free',Middlewares.checkAdmin,FindController.findAllFreeRooms);


//Find occupied room
router.get('/rooms/occupied',FindController.findOccupiedRooms);

//Find all accomodated
router.post('/occupied/rooms/details',FindController.findAllOccupied) ;

//Find all hostels of a College
router.post('/hostels/all',Middlewares.checkAdmin,FindController.findAllHostel) ;

//Applications
router.post('/findApplications',ApplicationController.findAllApplications);
router.post('/application/accept',ApplicationController.accept);
router.post('/application/reject',ApplicationController.reject);
router.post('/findApplicationslength',ApplicationController.findAllApplicationslength);


//queries
router.post('/findQueries',Middlewares.checkAdmin,QueryController.getAllFeedbacks);
router.post('/query',Middlewares.checkAdmin,QueryController.sendQueryReply);
router.post('/querieslength',Middlewares.checkAdmin,QueryController.getAllFeedbackslength);

module.exports=router;