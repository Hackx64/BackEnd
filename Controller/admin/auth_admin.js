const Admins = require("../../Models/admins");

const register = (req,res,bcrypt)=>{
    const { email,name,password,phone,college } = req.body ;
    if(!email || !name || !password || !phone || !college)
        return res.status(400).json('Pls Enter the credentials properly') ;
    
    Admins.find({'email':email},(err,result)=>{
        if(result.length)
            return res.status(400).json("Admin with same mail already exists !") ;
        
        const hash = bcrypt.hashSync(password) ;
        new Admins({
            name,
            email,
            password:hash,
            phone,
            college
        }).save((err,result)=>{
            if(err){
                console.log(err);
                res.status(500).json("Error in creating new user in Database.");
            }
            return res.status(200).json("You are registered, login to our app") ;
        });
        
    })
}

const login = (req,res,bcrypt,jwt)=>{
    const {email, password} = req.body ;
    Admins.find({'email':email},(err,result)=>{
        if(result.length)
        {
            if(bcrypt.compareSync(password , result[0].password))
            {
                const {id,institute,name} = result[0] ;
                const token = jwt.sign ({id, name, email, institute}, process.env.JWT_SECRET_KEY, {expiresIn : '60m'});
                return res.status(200).json({token}) ;
            }
            return res.status(401).json("Wrong Password") ;
        }
        res.status(200).json('No such user exists , Pls register !') ;
    })
}
const getAdmin = (req,res,jwt)=>{
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



module.exports = {
    register,
    login,
    getAdmin
}