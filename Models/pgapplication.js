const mongoose = require('mongoose');

const schema = new mongoose.Schema ({
    email : {
        type : String,
        required : true
    },
    phone : {
        type : String,
        required : true
    },
    rooms:{
        type: Number ,
        required: true
    },
    institute:{
        type:String,
        ref:'Institutes'
    },
    name: {
        type:String ,
        required: true
    },
    food:{
        type: Boolean ,
        enum:["Yes","No"]
    },
    photos:[{
        type:String ,
        required: true
    }] ,
    documents:{
        type:String ,
        required: true  
    }
},{
    timestamps:true
})
const PGapplication = mongoose.model ('pg-application', schema);
module.exports= PGapplication;