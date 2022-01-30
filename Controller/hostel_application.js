const Application = require ('../Models/application');
const Users = require ('../Models/users');
const Rooms = require('../Models/hostel_rooms');
const Institute = require('../Models/institutes') ;
const PGapplication = require('../Models/pgapplication');
const pgapplicationreply = require('../Utils/nodemailer');
const cloudinary = require ('cloudinary').v2;

const sendApplication = (req, res) => {
    const {email , disability_status} = req.body;
    Users.findOne({'email' : email}, async (err, result) => {
        if (result) {
            const flag = await Application.exists({student_email:email,$or:[{status:'AC'},{status:null}]});
            if(flag)return res.status(400).json("You have already applied or you already have a hostel.");
            new Application ({
                student_id:result.id,
                student_email:email,
                student_disability:disability_status,
                institute: result.institute
            }).save ((err, result) => {
                if (err) {
                    console.log (err);
                    res.status (400).json ({message : "Bad Request"});
                }
                else {
                    //console.log(result);
                    res.status(200).json ({message : "Application for hostel booking submitted successfully"});
                }
            })
        }
        else {
            console.log ("User with the email doesn't exist");
        }
    });
}

const getHostel = (req, res) => {
    const {email} = req.body;
    Users.findOne({'email' : email}, (err, result) => {
        if (err) {
            res.status(400).json ({message : "Bad Request"});
        }else {
            const hostel = result.hostel;
            res.status (200).json (hostel);
        }
    });
}
const getApplication = async(req,res)=>{
    const {email} = req.body ;
    const application = await Application.find({"student_email":email}) ;
    if(application.length){
        if(application[0].status == null) res.status(200).json({"status":"Pending"}) ;
        else if(application[0].status == "AC") res.status(200).json({"status":"Accepted"}) ; 
        else res.status(200).json({"status":"Rejected"}) ; 
    }
    else res.status(200).json({"status":"Not Applied"}) ; 
}
const roomchangeapplication = async(req,res)=>{
    const {email , reason} = req.body;
    Users.findOne({'email' : email}, async (err, result) => {
        if (result) {
            const flag = await Application.find({student_email:email,status:'AC'});
            const exists = await Application.exists({student_email:email,status:'RC'});
            if(flag.length == 0)return res.status(200).json("You are not allocated a room yet !!!");
            if(exists.length) return res.status(200).json("You have already given an application , pls wait until the Admin responds , U can reach out to him for any furthuer queries")
            new Application ({
                student_id:result.id,
                student_email:email,
                status:"RC",
                student_disability:flag[0].disability_status,
                reason : reason
            }).save ((err, result) => {
                if (err) {
                    console.log (err);
                    res.status (400).json ({message : "Bad Request"});
                }
                else {
                    //console.log(result);
                    res.status(200).json ("Application for room change submitted successfully");
                }
            })
        }
        else {
            console.log ("User with the email doesn't exist");
        }
    });
}

const leaveHostel = async (req,res) =>{
    try {
        const student_id = req.body.user;
        const student = await Users.findById(student_id);
        if(!student.hostel)return res.status(400).json("You don't have a Hostel!");
        const room = await Rooms.findById(student.hostel);
        room.residents.pull(student_id);
        if(room.full)
            room.full=false;
        student.hostel = false;
        await room.save();
        await student.save();
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Internal Server Error",error});
    }
}

const checkroomchange = async(req,res)=>{
   const {email} = req.body.user ;
   const flag = await Application.exists({student_email:email,status:'RC'});
   console.log(flag) ;
   return res.status(200).json(flag) ;
}

const pgapplication = async(req,res)=>{
    const {email,phone,rooms,food,name,institute} = req.body ;
    const inst = await Institute.find({"name":institute}) ;
    cloudinary.config({ 
        cloud_name: 'hosterr', 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });
    let test = await cloudinary.uploader.upload (file.path, (err, result) => {   
        if (err) 
            return res.status (200).send ('document upload error');
    });
    const pg  = await PGapplication.create({
       email ,
       phone ,
       rooms ,
       food ,
       name ,
       institute: inst.id 
    });
    const mail = pgapplicationreply(email,name,inst.name);
    let info = transporter.sendMail(mail,(err,info)=>{
        if(err)return res.status(500).json({msg:"Unable to send query reply to student",err});
        res.status(200).json("Mail sent successfully");
    });

    res.status(200).json("Your Response is recorded !");  
}
module.exports = {
    sendApplication,
    getHostel,
    getApplication,
    roomchangeapplication,
    leaveHostel,
    checkroomchange,
    pgapplication
}
