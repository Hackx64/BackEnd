const Feedback = require ('../Models/feedback');
const Users = require('../Models/users');

const feedbackService = (req, res) => {
    const {email, feedback} = req.body;
    Users.find ({'email' : email}, (err, result) => {
        if (result.length) {
            new Feedback ({
                email, 
                feedback
            }).save ((err, result) => {
                if (result) {
                    res.status (200).json ({message : "Thank you for submitting feedback"});
                }else {
                    res.status(400).json ({message : "Bad Request"});
                }
            })
        }
        else {  
            console.log ("User with the email doesn't exist");
        }
    })
}

module.exports = feedbackService;