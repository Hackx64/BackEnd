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
                student_disability:disability_status
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

module.exports = {
    sendApplication,
    getHostel
}
