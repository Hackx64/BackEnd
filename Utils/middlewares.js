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
    //console.log(req.user) ;
    if(!req.body.user)
        return res.status(401).json("You are not authenticated.");
    const id = req.body.user;
    const flag = await Admins.exists({id:id}); 
    if(flag)
        next();
    else
        return res.status(403).json("You are not an Admin!");
}

const checkUserAuthentication = (req,res,next)=>{
    if(!req.user)
        return res.status(401).json("You are not authenticated.");
    next();
}


module.exports={
    checkAdmin,
    extractFromToken
}