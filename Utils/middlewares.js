const jwt=require("jsonwebtoken");
const Admins=require("../Models/admins");

const extractFromToken = (req,res,next)=>{
    const token=req.body.token;
    if(token){
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decodedToken)=>{
            if(err)
                return res.status(403).json("Token Invalid/Expired");
            req.user=decodedToken;
            next();
        });
    }else
        next();
}  

const checkAdmin = async (req,res,next)=>{
    if(!req.user)
        return res.status(401).json("You are not authenticated.");
    const {id} = req.user;
    const flag = await Admins.exists({id:id}); 
    if(flag)
        next();
    else
        return res.status(403).json("You are not an Admin!");
}


module.exports={
    checkAdmin,
    extractFromToken
}