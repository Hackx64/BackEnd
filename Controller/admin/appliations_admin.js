const Hostels=require("../../Models/hostels");
const Rooms = require("../../Models/hostel_rooms");
const Applications = require("../../Models/application");
const Users = require("../../Models/users");
const {transporter,acceptMail,rejectMail}=require("../../Utils/nodemailer");
const Admins = require("../../Models/admins");

const findAllApplications = async (req,res)=>{
    try {
        console.log(req.body.user)
        const admin = await Admins.findById(req.body.user.id) ;
        const applications = await Applications.find({"institute":admin.institute}).populate({path:'student_id',select:'name email phone gender year address'});
        const result = applications.filter(item => item.status != "AC") ;
        res.status(200).json(result);
    } catch (error) {
        //console.log(error) ;
        res.status(500).json({message:"Error while fetching from Database",error});
    }
}

const findAllApplicationslength = async (req,res)=>{
    try {
        console.log(req.body.user)
        const admin = await Admins.findById(req.body.user.id) ;
        const applications = await Applications.find({"institute":admin.institute}).populate({path:'student_id',select:'name email phone gender year address'});
        const result = applications.filter(item => item.status == null || item.status == "RC") ;
        res.status(200).json(result.length);
    } catch (error) {
        //console.log(error) ;
        res.status(500).json({message:"Error while fetching from Database",error});
    }
}

const accept = async (req,res)=>{
    try {
        const {application_id} = req.body;
        console.log(application_id) ;
        if(!application_id)
            return res.status(400).json("Provide Application id of the application");
        
        const application = await Applications.findById(application_id);
        application.status = "AC";
        const email = application.student_email;
        await application.save();

        const mail = acceptMail(email);

        bookRoom(application.student_id)
        .then(async (hostels)=>{
            let room_id=null;
            hostels.forEach(h => {
                if(h.rooms.length)
                    room_id=h.rooms[0].id;
            });

            if(!room_id)return res.status(200).json("No rooms available currently");

            let id = application.student_id;
            let student = await Users.findById(id);
            let room = await Rooms.findById(room_id);
            if(student.hostel){
                let curr_room = await Rooms.findById(student.hostel);
                curr_room.residents.pull(id);
                curr_room.full=false;
                await curr_room.save();
            }
            student.hostel=room_id;
            room.residents.push(id);
            if(room.residents.length==room.roomType)
                room.full=true;
            await room.save();
            await student.save();
            
            res.status(200).json({msg:"Application accepted!",room});
            let info = transporter.sendMail (mail, (error, info) => {
                if(error) {
                    console.log (error);
                    res.status(500).json ({message : 'Error in sending mail about hostel room being accepted',error});
                }else {
                    console.log ('Message sent : ' + info.response);
                    res.status(200).json('Mail sent successfully !');
                }
            });
        })
        .catch((err)=>{
            console.log(err);
            res.status(500).json({msg:"Failed to book hostel room",err})
        });
    } catch (error) {
        console.log(err);
        res.status(500).json({msg:"Failed to save application to Db",error});
    }
}

const reject = async (req,res)=>{
    try {
        const {application_id} = req.body;
        console.log(application_id) ;
        if(!application_id)
            return res.status(400).json("Provide Application id of the application");
        
        const application = await Applications.findById(application_id);
        application.status = "RJ";
        const email = application.student_email;
        await application.save();
        const mail = rejectMail(email);
        let info = transporter.sendMail (mail, (error, info) => {
            if(error) {
                console.log (error);
                res.status(500).json ({message : 'Error in sending mail about hostel room being rejected',error});
            }else {
                console.log ('Message sent : ' + info.response);
                res.status(200).json('Mail sent successfully !');
            }
        });
        res.status(200).json("Application Rejected");
    } catch (error) {
        res.status(500).json({msg:"Failed to save application to Db",error});
    }
}


function bookRoom(id){
    return new Promise(async(resolve,reject)=>{
        let student = await Users.findById(id);
        let year = student.year;
        let room_size=null;
        if(year===1)room_size=3;
        else if(year==2)room_size=2;
        else
            room_size=1;
        let gender = student.gender;
        Hostels.find({gender:'Boys'}).populate('rooms',null,{roomType:room_size,full:false}).exec((err,res)=>{
            if(err)
                return reject(err);
            resolve(res);
        });
    });
}

module.exports={
    findAllApplications,
    accept,
    reject,
    findAllApplicationslength
}