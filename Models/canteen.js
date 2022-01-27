const mongoose = require('mongoose');

const canteenSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true
    },
    institute:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Institutes'
    },
    start:{
        type:String,
        required:true
    },
    end:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

const Canteens = mongoose.model('Canteens',canteenSchema);

module.exports = Canteens;
