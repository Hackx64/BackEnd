const Application = require ('../Models/application');
const Users = require ('../Models/users');

const sendApplication = (req, res) => {
    const {email , disability_status} = req.body;
    Users.find ({'email' : email}, (err, result) => {
        if (result.length) {
            new Application ({
                id:result.id,
                email:student_email,
                disability_status
            }).save ((err, res) => {
                if (err) {
                    console.log (err);
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
