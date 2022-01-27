const { json } = require("express");
const jwt=require("jsonwebtoken");
const Admins=require("../Models/admins");

const extractFromToken = (req,res,next)=>{
    if(req.body.user){
        req.body.user=JSON.parse(req.body.user);
        req.user=req.body.user;
    }
    next();
}  

//cheking whether logged user is Admin
const checkAdmin = async (req,res,next)=>{
    try {
        if(!req.body.user)
            return res.status(401).json("You are not authenticated.");
        const id = req.body.user.id;
        const flag = await Admins.exists({id:id}); 
        if(flag)
            next();
        else
            return res.status(403).json("You are not an Admin!");
    } catch (error) {
        res.status(500).json(error);
    }
}


//for checking whether user is logged in
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