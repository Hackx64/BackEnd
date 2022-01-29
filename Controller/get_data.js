const Canteens = require("../Models/canteen");
const Hostels = require('../Models/hostels');


const getCanteen = async (req,res)=>{
    try {
        const d = new Date();
        let s = d.getHours()+":"+d.getMinutes();
        const student = req.body.user;
        const institute = student.institute;
        const canteens = await Canteens.find({institute:institute,start:{$lte:s},end:{$gte:s}});
        res.status(200).json(canteens);
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

module.exports={
    getCanteen,
    findPositionLink
}

