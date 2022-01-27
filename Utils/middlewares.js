const jwt=require("jsonwebtoken");
const Admins=require("../Models/admins");

const extractFromToken = (req,res,next)=>{
    if(req.body.user)
        req.user=req.body.user;
    next();
}  

const checkAdmin = async (req,res,next)=>{
    //console.log(req.user) ;
    if(!req.body.user)
        return res.status(401).json("You are not authenticated.");
    const id = req.body.user.id;
    const flag = await Admins.exists({id:id}); 
    if(flag)
        next();
    else
        return res.status(403).json("You are not an Admin!");
}

const checkUserAuthentication = (req,res,next)=>{
    if(!req.body.user)
        return res.status(401).json("You are not authenticated.");
    next();
}


module.exports={
    checkAdmin,
    extractFromToken,
    checkUserAuthentication
}