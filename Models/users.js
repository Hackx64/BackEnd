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
            default: null
        },
        year:{
            type:Number
        },
        department: String ,
        image: String ,
        hostel:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Hostels',
            default: null
        },
        room:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'HotelRooms'
        }
    },{
        timestamps:true
    }
);
const Users = mongoose.model('Users',schema);
module.exports=Users;