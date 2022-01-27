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
        const {query_id} = req.params;
        const query = await Queries.findById(query_id);
        const email = query.email;
        const queryMsg = query.query;
        const {content} = req.body;
        const mail = queryReply(email,queryMsg,content);
        transporter.sendMail(mail,(err,info)=>{
            if(err)return res.status(500).json({msg:"Unable to send query reply to student",err});
            res.status(200).json("Mail sent successfully");
        });
    } catch (error) {
        res.status(500).json({msg:"Failed to reply to query of Student",error});
    }
}

module.exports={
    getAllFeedbacks,
    sendQueryReply
}