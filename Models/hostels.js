const mongoose=require("mongoose");

const hostelSchema= new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    gender:{
        type:String,   //TRUE for Boys and FALSE for Girls
        enum:["Boys","Girls"],
        required:true
    },
    address:{
        type:String,
        required:true
    }
    ,rooms:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'HostelRooms'
    }]
},{
    timestamps:true
});

const Hostels=mongoose.model('Hostels',hostelSchema);

module.exports=Hostels;