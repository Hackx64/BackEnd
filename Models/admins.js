const mongoose = require('mongoose') ;
const schema = new mongoose.Schema({
        name: String,
        email: {
            type:String,
            unique:true,
            required:true
        },
        password: String,
        phone :  {
            type:String,
            unique:true,
            required:true
        },
        college:{
            type:String,
            required:true
        },
        institute:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Institutes'
        },
        verified:{
            type:Boolean,
            default:false
        },
        doc:{
            type:String,
            required : true
        }
    },{
        timestamps:true
    }
);
const Admins = mongoose.model('Admins',schema);
module.exports=Admins;