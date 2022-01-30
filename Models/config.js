const mongoose=require('mongoose');
const mysql = require ('mysql');

var db = mysql.createConnection ({
    host : process.env.AWS_RDS_HOST,
    port : process.env.AWS_RDS_PORT,
    user : process.env.AWS_RDS_USER,
    database : process.env.AWS_RDS_DATABASE,
    password : process.env.AWS_RDS_PASSWORD
})
mongoose.connect(`${process.env.MONGO_PATH}`,{
    useNewUrlParser: true ,
    useUnifiedTopology: true
}).then(()=>{
    console.log('Database Connection Succesful !!!');
}).catch((err)=> console.log(err,"Error in establishing Database."));

db.connect ((err) => {
    if(err) {
        console.log (err);
    }
    else {
        console.log ('AWS RDS Connection Successful!');
    }
})

module.exports={
    mongoose ,
    db
};