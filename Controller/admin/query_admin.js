const Queries = require('../../Models/queries');
const {transporter,queryReply}=require("../../Utils/nodemailer");

const getAllFeedbacks = async (req,res)=>{
    try {
        const admin = req.body.user;
        const queries = await Queries.find({institute:admin.institute});
        res.status(200).json(queries);
    } catch (error) {
        res.status(500).json({msg:"Failed to fetch quries of Students",error});
    }

}

const sendQueryReply = async (req,res)=>{
    try {
        console.log(req.body) ;
        const {query_id} = req.body;
        const query = await Queries.findById(query_id);
        const email = query.email;
        const queryMsg = query.message;
        const content = req.body.content;
        const mail = queryReply(email,queryMsg,content);
        let info = transporter.sendMail(mail,(err,info)=>{
            if(err)return res.status(500).json({msg:"Unable to send query reply to student",err});
            res.status(200).json("Mail sent successfully");
        });
        await query.remove() ;
    } catch (error) {
        res.status(500).json({msg:"Failed to reply to query of Student",error});
    }
}
const getAllFeedbackslength = async (req,res)=>{
    try {
        const admin = req.body.user;
        const queries = await Queries.find({institute:admin.institute});
        res.status(200).json(queries.length);
    } catch (error) {
        res.status(500).json({msg:"Failed to fetch quries of Students",error});
    }

}
module.exports={
    getAllFeedbacks,
    sendQueryReply,
    getAllFeedbackslength
}