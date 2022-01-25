const Institutes=require("../../Models/institutes");
const Admins=require("../../Models/admins");
const Hostels=require("../../Models/hostels");
const Rooms = require("../../Models/hostel_rooms");

const addInstitute=(req,res)=>{
    const {name, address} = req.body;
    const admin = req.user;
    Institutes.create({
        name,
        address
    },async (err,newInstitute)=>{
        if(err)
            return res.status(500).json("Error in creating new Institue in the Database");
        await Admins.findOneAndUpdate({id:admin.id},{institute:newInstitute.id});
        res.status(200).json({
            newInstitute
        });
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
        const {hostelname,roomno,fees,roomType} = req.body;
        //console.log('reached') ;
        const [hostel] = await Hostels.find({"name":hostelname});
        //console.log(hostel) ;
        
        const hostelId = hostel._id ;
        //console.log(hostelId) ;
        const room  = await Rooms.create({
            roomType ,
            hostelId ,
            fees ,
            roomno ,
        });     
        hostel.rooms.push(room._id);
        //console.log(room._id) ;
        await hostel.save();

        res.status(200).json("Room added Succesfully !");
    } catch (err) {
        res.status(400).json({message:"Bad Request.",err:err});
    }
}

module.exports={
    addInstitute,
    addHostel,
    addRoom
}