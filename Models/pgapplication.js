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
        type:mongoose.Schema.Types.ObjectId,
        ref:'Institutes'
    },
    name: {
        type:String ,
        required: true
    },
    food:{
        type: Boolean ,
        required : true
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