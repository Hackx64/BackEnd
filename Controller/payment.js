const { db } = require("../Models/admins");
const Applications = require('../Models/application');
const Users = require("../Models/users");
const Rooms = require("../Models/hostel_rooms");
const oneDay = 24*60*60*1000;

const findAmount = (stu_id)=>{
    return new Promise(async (resolve,reject)=>{
        const student = await Users.findById(stu_id);
        if(student.last_payment)return resolve(student.last_payment,student.hostel);
        Applications.find({student_id:stu_id,status:null}).exec((err,res)=>{
            if(err)return reject(err);
            return resolve({date:res[0].createdAt,room_id:student.hostel});
        });
    });
}
const findPaymentAmount = (req,res)=>{
    findAmount(req.user.id)
    .then(async (res)=>{
        const room = await Rooms.findById(res.room_id);
        const amount = Math.ceil(Math.abs (new Date() - new Date(res.date)) / oneDay) * room.fees;
        res.status(200).json(amount);
    })
    .catch((err)=>{
        console.log({msg:"Failed to fetch amount",err});
    });
}
const makePayment = async(req,res, stripe)=>{
    
    const {amount, stripeToken} = req.body;
    const {id} = req.body.user;
    const student = await Users.findById(id);
    if (!amount || !stripeToken)
        return res.status(400).json("Bad Request Credential for Token/Amount"); 
    try {
        stripe.charges.create({
            amount:amount*100,
            currency: 'inr',
            source: stripeToken,
            description: 'Thank you for your generous donation.'
        })
        .then((charge) => {
            var transaction_id = charge.id; 
            var amount = charge.amount;
            var transaction_source = charge.stripeToken;
            var trasaction_description = charge.description;
            
            var value = [[transaction_id, amount, transaction_source, trasaction_description]];
            var sql = 'INSERT INTO Transaction (transaction_id, amount, transaction_source, transaction_description) VALUES ?';
            
            db.query (sql, [value], async(err, res_aws_rds) => {
                if (err) {
                    console.log ('Upload Failure in AWS RDS Unit');
                }
                else {
                    student.last_payment = new Date();
                    await student.save();
                    console.log ('Transaction Upload in AWS RDS successful');
                }
            }) 
            res.status(200).json({message:"Payment Successful",charge});
        })
        .catch(err => res.status(500).json({message:"Server Error while processing Payment",error:err}));
    } catch(err){ 
        res.status(500).json("Internal Server Error");
    }
}



module.exports={
    makePayment,
    findPaymentAmount
}