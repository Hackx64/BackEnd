const mongoose = require ('mongoose');
const schema = mongoose.Schema ({
    institute :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Institutes"
    },
    name: {
        type : String,
        required : true,
    },
    room_numbers : {
        type : Array,
        default : [201, 202, 203, 204, 205]
    },
    address : {
        type : String,
        required : true
    }
})
const Guest = mongoose.model ('Guest', schema);
module.exports=Guest;