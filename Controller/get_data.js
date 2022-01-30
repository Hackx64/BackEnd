const Admins = require("../Models/admins");
const Canteens = require("../Models/canteen");
const Hostels = require('../Models/hostels');
const Institutes = require("../Models/institutes");
const Users = require('../Models/users')

const getCanteen = async (req,res)=>{
    try {
        const d = new Date();
        let s = d.getHours()+":"+d.getMinutes();
        const student = req.body.user;
        const institute = student.institute;
        const canteens_open = await Canteens.find({institute:institute,start:{$lte:s},end:{$gte:s}});
        const canteens_closed = await Canteens.find({institute:institute,$or:[{start:{$gt:s}},{end:{$lt:s}}]});
        res.status(200).json({canteens_open,canteens_closed});
    } catch (error) {
        console.log(error)
        res.status(400).json({msg:"Could not find canteens",error});
    }
}

const findPositionLink= async(req,res)=>{
    try {
        const {hostel_id} = req.body;
        const hostel = await Hostels.findById(hostel_id);
        const address = hostel.address;
        address.replace(" ","+");
        let result = `https://www.google.com/maps/search/${address}`;
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json("Correct hostel id not provide."); 
    }
}

const findroomdetails = async (req,res)=>{
    try {
        const user = req.body.user;
        const id = user.id;
const users_with_room = await Users.findById(id).populate({path:'hostel',select:'roomno fees hostelId',populate:{path:'hostelId',select:'name address college'}});
const [admin] = await Admins.find({"institute":user.institute}) ;  
const {name} = admin  
res.status(200).json([users_with_room,name]);
    } catch (error){
        console.log(error);
        res.status(400).json("Failed to fetch users");
    }
}
const getAllinstitutes = async(req,res)=>{
    try{
     const institutes = await Institutes.find({},{name:1}) ;
     res.status(200).json(institutes) ;
    }
    catch{
        res.status(400).json("Error in fetching university") ;
    }
}
module.exports={
    getCanteen,
    findPositionLink,
    findroomdetails,
    getAllinstitutes
}

