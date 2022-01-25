const mongoose=require("mongoose");

const hostelRoomSchema= new mongoose.Schema({
    roomType:{
        type:Number,
        enum:[1,2,3],
        required:true
    },
    full:{
        type:Boolean,   
        default:false
    },
    residents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    }],
    hostelId:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:'Hostels',
        required:true
    },
    fees:{
        type:Number,
        required:true
    },
    roomno:{
        type:Number,
        required:true ,
        unique:true
    }
},{
    timestamps:true
});

const HostelRooms=mongoose.model('HostelRooms',hostelRoomSchema);

module.exports=HostelRooms;