const mongoose = require ('mongoose');

const schema = new mongoose.Schema ({
    email : {
        type : String, 
        required : true
    },
    feedback : {
        type : String
    }
})

const feedback = mongoose.model ('Feedback', schema);
module.exports = feedback;