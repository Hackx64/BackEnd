const Queries = require ('../Models/queries');
const Users = require('../Models/users');

const queryService = (req, res) => {
    const {email, message , subject} = req.body;
    Users.find({'email' : email}, (err, result) => {
        if (result.length) {
            new Queries ({
                institute:result.institute,
                email, 
                subject,
                message
            }).save ((err, result) => {
                if (result) {
                    res.status (200).json ({message : "Thank you for submitting your query"});
                }else {
                    res.status(400).json ({message : "Bad Request"});
                }
            })
        }
        else {  
            console.log ("User with the email doesn't exist");
        }
    });
}

module.exports = {
    queryService
}