const mongoose=require('mongoose');

mongoose.connect(`${process.env.MONGO_PATH}`,{
    useNewUrlParser: true ,
    useUnifiedTopology: true
}).then(()=>{
    console.log('Database Connection Succesful !!!');
}).catch((err)=> console.log(err,"Error in establishing Database."));

module.exports=mongoose;