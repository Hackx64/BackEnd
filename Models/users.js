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
            ref:'Institutes'
        },
        gender:{
            type:String,
            enum:["Boys","Girls"],
            required:true
        },
        roll:{
            type:String,
            unique:true,
            required:true
        },
        year:{
            type:Number,
            required:true
        },
        department: String ,
        image: String ,
        hostel:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Hotels',
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