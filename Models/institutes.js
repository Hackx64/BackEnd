const mongoose=require("mongoose");

const instituteSchema= new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    hostels:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hostels'
    }]
},{
    timestamps:true
});

const Institutes=mongoose.model('Institutes',instituteSchema);

module.exports=Institutes;