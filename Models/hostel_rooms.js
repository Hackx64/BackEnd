const mongoose=require("mongoose");

const hostelRoomSchema= new mongoose.Schema({
    room_type:{
        type:Number,
        enum:[1,2,3],
        required:true
    },
    full:{
        type:Boolean,   //TRUE for Boys and FALSE for Girls
        required:true
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