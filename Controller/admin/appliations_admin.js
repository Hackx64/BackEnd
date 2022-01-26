const Hostels=require("../../Models/hostels");
const Rooms = require("../../Models/hostel_rooms");
const Applications = require("../../Models/application");
const Users = require("../../Models/users");
const {transporter,acceptMail,rejectMail}=require("../../Utils/nodemailer");

const findAllApplocations = async (req,res)=>{
    try {
        const applications = await Applications.find({}).populate({path:'student_id',select:'name email phone'});
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({message:"Error while fetching from Database",error});
    }

}

const accept = async (req,res)=>{
    try {
        const {application_id} = req.body;
        if(!application_id)
            return res.status(400).json("Provide Application id of the application");
        
        const application = await Applications.findById(application_id);
        application.status = "AC";
        const email = application.student_email;
        await application.save();
        const mail = acceptMail(email);
        let info = transporter.sendMail (mail, (error, info) => {
            if(error) {
                console.log (error);
                res.status(500).json ({message : 'Error in sending mail about hostel room being accepted',error});
            }else {
                console.log ('Message sent : ' + info.response);
                res.status(200).json('Mail sent successfully !');
            }
        });
        res.status(200).json("Application accepted!");
    } catch (error) {
        res.status(500).json({msg:"Failed to save application to Db",error});
    }
}

const reject = async (req,res)=>{
    try {
        const {application_id} = req.body;
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


async function bookRoom(id){
    let student = await Users.findById(id);
    let year = student.year;
    let room_size=null;
    if(year===1)room_size=3;
    else if(year==2)room_size=2;
    else
        room_size=1;
    
}

module.exports={
    findAllApplocations,
    accept,
    reject
}