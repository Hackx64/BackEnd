const mongoose = require ('mongoose');

const schema = new mongoose.Schema ({
    student_id :{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    }, 
    student_email : {
        type : String,
        required : true
    },
    student_disability_status : {
        type : String,
        required : true
    },
    status : { 
        type : String,
        enum: ["AC", "RJ", null],
        default : null
    }
})
const Application = mongoose.model ('application', schema);
module.exports=Application;