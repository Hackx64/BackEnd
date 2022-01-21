const mongoose=require("mongoose");

const hostelRoomSchema= new mongoose.Schema({
    roomType:{
        type:Number,
        enum:[1,2,3],
        required:true
    },
    full:{
        type:Boolean,   //
        default:false
    },
    residents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    }]
},{
    timestamps:true
});

const HostelRooms=mongoose.model('HostelRooms',hostelRoomSchema);

module.exports=HostelRooms;