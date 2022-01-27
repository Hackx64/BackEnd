const mongoose = require ('mongoose');

const schema = new mongoose.Schema ({
    institute:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Institutes'
    },
    email : {
        type : String, 
        required : true
    },
    query : {
        type : String
    }
})

const Queries = mongoose.model ('Queries', schema);
module.exports = Queries ;