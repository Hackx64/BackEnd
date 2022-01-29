const Application = require ('../Models/application');
const Users = require ('../Models/users');

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
const checkroomchange = async(req,res)=>{
   const {email} = req.body.user ;
   const flag = await Application.exists({student_email:email,status:'RC'});
   console.log(flag) ;
   return res.status(200).json(flag) ;
}
module.exports = {
    sendApplication,
    getHostel,
    getApplication,
    roomchangeapplication,
    checkroomchange
}
