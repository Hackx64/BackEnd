const Application = require ('../Models/application');
const Users = require ('../Models/users');

const sendApplication = (req, res) => {
    const {email , disability_status} = req.body;
    Users.find ({'email' : email}, (err, result) => {
        if (result.length) {
<<<<<<< HEAD
            Application.findOne ({'email' : email}, (err, result_application) => {
                if (result_application.length) {
=======
            new Application ({
                id:result.id,
                email:student_email,
                disability_status
            }).save ((err, res) => {
                if (err) {
                    console.log (err);
>>>>>>> 3ecfeb9d697120066279f09b3973e3b3be3d7b16
                    res.status (400).json ({message : "Bad Request"});
                }
                else {
                    new Application ({
                        email,
                        disability_status
                    }).save ((err, res_app) => {
                        if (err) {
                            console.log (err);
                            res.status (400).json ({message : "Bad Request"});
                        }
                        else {
                            res.status(200).json ({message : "Application for hostel booking submitted successfully"});
                        }
                    })
                }
            })
        }
        else {
            console.log ("User with the email doesn't exist");
        }
    })
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
    })
}

module.exports = {
    sendApplication,
    getHostel
}
