const mongoose = require ('mongoose');
const Users = require('./users');

const schema = mongoose.Schema ({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Users'
    },
    guest_house_details : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Guest'
    },
    guest_house_number : {
        type : Number,
        required : true
    },
    arrival_date : {
        type : Date,
        required : true
    },
    departure_date : {
        type : Date,
        required : true
    },
    per_day_charge : {
        type : Number,
        required : true
    }
})

const GuestHouseApplication = mongoose.model('GuestHouseApplication', schema);
module.exports = GuestHouseApplication;