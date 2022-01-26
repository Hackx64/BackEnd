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
    const id = req.body.user;
    const admin = await Admins.findById(id);
    const [Institute] = await Institutes.find({"name":admin.college});
    //console.log(institute) ;
    const {name, address, gender} = req.body;
    const college = admin.college;
    const institute = Institute._id ;
    Hostels.create({
        name,
        gender,
        address,
        college,
        institute
    },async (err,newHostel)=>{
        if(err)
            return res.status(500).json({message:"Error in creating New Hostel in the Database",error:err});
        Institute.hostels.push(newHostel._id);
        await Institute.save();
        //console.log(institute) ;
        res.status(200).json({
            newHostel
        });
    });
}

const addRoom= async(req,res)=>{
    try {
        const {hostelname,roomno,fees,roomType} = req.body;
        console.log(req.body) ;
        //console.log('reached') ;
        const [hostel] = await Hostels.find({"name":hostelname}) ;
        
        const hostelId = hostel._id ;
        const Room = await Rooms.find({"hostelId":hostelId , "roomno":roomno}) ;
        //console.log(Room)
        if(Room.length > 0) return res.status(200).json("Room with same room number already exists in the hostel") ;
        const room  = await Rooms.create({
            roomType ,
            hostelId ,
            fees ,
            roomno ,
        });     
        console.log(Room) ;
        hostel.rooms.push(room._id);
        //console.log(room._id) ;
        await hostel.save();

        res.status(200).json("Room added Succesfully !");
    } catch (err) {
        console.log(err) ;
        res.status(400).json({message:"Bad Request.",err:err});
    }
}

module.exports={
    addInstitute,
    addHostel,
    addRoom
}