const Institutes=require("../../Models/institutes");
const Admins=require("../../Models/admins");
const Hostels=require("../../Models/hostels");
const Rooms = require("../../Models/hostel_rooms");



const findAllFreeRooms = async (req,res)=>{
    try {
        const {id} = req.user;
        let free=0;
        const admin = await Admins.findById(id,{institute:1});
        const institute = await Institutes.findById(admin.institute).populate({path:'hostels',select:'rooms'}).populate({path:'rooms',select:'full'});
        institute.hostels.forEach(hostel => {
            hostel.rooms.forEach(room => {
                if(!room.full)free++;
            });
        });
        res.status(200).json(free);
    } catch (error) {
        res.status(500).json("Server Error during finding Free rooms");
    }

}


module.exports={
    findAllFreeRooms
}