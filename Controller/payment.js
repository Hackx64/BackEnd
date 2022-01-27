const { db } = require("../Models/admins");
const Applications = require('../Models/application');

const findAmount = (stu_id)=>{
    return new Promise((resolve,reject)=>{
        Applications.find({student_id:stu_id,status:null}).exec((err,res)=>{
            if(err)return reject(err);
            res.length&&resolve(res[0]);
        });
    });
}

const makePayment = (req,res, stripe)=>{
    
    const {amount, stripeToken} = req.body;
    findAmount(req.user.id).then((res)=>console.log(res)).catch((err)=>console.log(err));
    if (!amount || !stripeToken)
        return res.status(400).json("Bad Request Credential for Token/Amount"); 
    return;
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
            
            db.query (sql, [value], (err, res_aws_rds) => {
                if (err) {
                    console.log ('Upload Failure in AWS RDS Unit');
                }
                else {
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
    makePayment
}