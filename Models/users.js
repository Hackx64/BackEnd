const mongoose = require('mongoose') ;
const { NULL } = require('mysql/lib/protocol/constants/types');
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
        institute:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Institutes',
            required:true
        },
        gender:{
            type:String,
            enum:["Boys","Girls"]
        },
        roll:{
            type:String,
            default:"Not Given"
        },
        address: String,
        year:{
            type:Number
        },
        department: String ,
        image: String ,
        hostel:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'HostelRooms',
            default: null
        },
        last_payment:{
            type:Date,
            default:null
        }
    },{
        timestamps:true
    }
);
const Users = mongoose.model('Users',schema);
module.exports=Users;