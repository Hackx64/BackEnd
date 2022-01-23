const Institutes=require("../../Models/institutes");
const Admins=require("../../Models/admins");
const Hostels=require("../../Models/hostels");
const Rooms = require("../../Models/hostel_rooms");


const findAllRooms = async (req,res)=>{
    try {
        const {id} = req.user;
        let rooms=0;
        const admin = await Admins.findById(id,{institute:1});
        Institutes.findById(admin.institute).populate({path:'hostels',select:'rooms'}).exec((err,institute)=>{
            if(err)
                return res.status(400).json(err);
            institute.hostels.forEach(hostel => {
                rooms+=(hostel.rooms.length);
            });
            res.status(200).json(rooms);
        });
    } catch (error) {

        res.status(500).json({message:"Server Error during finding Free rooms",error});
    }

}


const findAllFreeRooms = async (req,res)=>{
    try {
        const {id} = req.user;
        let free=0;
        const admin = await Admins.findById(id,{institute:1});
        Institutes.findById(admin.institute).populate({path:'hostels',populate:{path:'rooms',select:'full'}}).exec((err,institute)=>{
            if(err)
                return res.status(400).json(err);
            institute.hostels.forEach(hostel => {
                hostel.rooms.forEach(room => {
                    if(!room.full)free++;
                });
            });
            res.status(200).json(free);
        });
    } catch (error) {

        res.status(500).json({message:"Server Error during finding Free rooms",error});
    }

}


module.exports={
    findAllFreeRooms,
    findAllRooms
}