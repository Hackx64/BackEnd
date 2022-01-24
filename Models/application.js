const mongoose = require ('mongoose');

const schema = new mongoose.Schema ({
    student_email : {
        type : String,
        required : true
    },
    student_disability_status : {
        type : String,
        required : true
    }
})
const Application = mongoose.model ('application', schema);
module.exports=Application;