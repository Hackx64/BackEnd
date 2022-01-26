const Users = require("../Models/users");

const login = (req,res,bcrypt,jwt)=>{
    const {email, password} = req.body ;
    Users.find({'email':email},(err,result)=>{
        if(result.length)
        {
            if(bcrypt.compareSync(password , result[0].password))
            {
                const {id,institute,name} = result[0] ;
                const api_key = process.env.api_key ;
                const token = jwt.sign ({id, name, email,institute}, process.env.JWT_SECRET_KEY, {expiresIn : '60m'});
                res.status(200).json({token}) ;
            }
            else res.status(401).json("Wrong Password") ;
        }
        else{
            return res.status(200).json('No such user exists , Pls register !') ;
        }
    })
}
const getuser = (req,res,jwt)=>{
    const {token} = req.params ;
    if(token){
            jwt.verify(token,process.env.JWT_SECRET_KEY,(err, decodedToken)=>{
                if(err){
                    return res.status(403).json("Your current Session is timed out, Pls Login Again") ;
                }
                res.status(200).json(decodedToken) ;
            });
    }
    else{
            res.status(403).json("Invalid token") ;
    }
}

module.exports ={
    login,
    getuser
}