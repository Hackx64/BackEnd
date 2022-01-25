const Institutes=require("../../Models/institutes");
const Admins=require("../../Models/admins");
const Hostels=require("../../Models/hostels");
const Rooms = require("../../Models/hostel_rooms");

const addInstitute=async (req,res)=>{
    const admin = await Admins.findById(req.user.id,{college:1});
    Institutes.create({
        name:admin.college,
    },async (err,newInstitute)=>{
        if(err)
            return res.status(500).json("Error in creating new Institue in the Database");
        await Admins.findOneAndUpdate({id:admin.id},{institute:newInstitute.id});
    });
} 

const addHostel=async (req,res)=>{
    const {id} = req.user;
    const admin = await Admins.findById(id,{email:1,institute:1});
    const institute = await Institutes.findById(admin.institute);
    const {name, address, gender} = req.body;
    Hostels.create({
        name,
        gender,
        address
    },async (err,newHostel)=>{
        if(err)
            return res.status(500).json({message:"Error in creating New Hostel in the Database",error:err});
        institute.hostels.push(newHostel.id);
        await institute.save();
        res.status(200).json({
            newHostel
        });
    });
}

const addRoom= async(req,res)=>{
    try {
        const {hostelId, roomType} = req.body;
        const room  = await Rooms.create({
            roomType
        });
        const hostel = await Hostels.findById(hostelId);
        hostel.rooms.push(room.id);
        await hostel.save();
        res.status(200).json(room);
    } catch (err) {
        res.status(400).json({message:"Bad Request.",err:err});
    }
}

module.exports={
    addInstitute,
    addHostel,
    addRoom
}