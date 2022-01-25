const Users = require("../Models/users");
const {transporter,verificationMailGen}=require("../Utils/nodemailer");

const register = (req,res,nodemailer,jwt)=>{
    const { email,name,password,phone,college } = req.body ;
    console.log(req.body) ;
    if(!email || !name || !password || !phone || !college){
        return res.status(400).json('Pls Enter the credentials properly') ;
    }
    Users.find({'email':email},(err,result)=>{
        if(result.length){
            return res.status(200).json("User with same mail already exists !") ;
        }
        const token = jwt.sign ({name, email, college, password, phone}, process.env.JWT_SECRET_KEY, {expiresIn : '20m'});
            
        let verificationMail=verificationMailGen(token,email);
        let info = transporter.sendMail (verificationMail, (error, info) => {
            if(error) {
                console.log (error);
                res.status(500).json ({message : 'Error in sending mail'});
            }else {
                console.log ('Message sent : ' + info.response);
                res.status(200).json('Mail sent successfully !');
            }
        });
    })
}
const verify = async (req,res,bcrypt,jwt)=>{
    const {token} = req.params;
    if(!token)
        return res.json(400,{message:"No token given."});
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedToken)=>{
        if(err){
            res.status(403).json("Session timed out , Pls try again") ;
            return;
        }
        const {name, email, college, password, phone} = decodedToken;
        const doesUserExit=await Users.exists({email:email});
        if(doesUserExit)
            return res.status(200).json('You are already registered , Pls go and login') ;

        const hash = bcrypt.hashSync(password) ;
        new Users({
            name,
            email,
            password:hash,
            phone,
            college
        }).save((err,result)=>{
            if(err){
                console.log(err);
                res.status(500).json({message:"Error in creating new user in Database."});
            }
            return res.status(200).json("You are registered, login to our app") ;
        });
    })
}


module.exports = {
    register,
    verify
}