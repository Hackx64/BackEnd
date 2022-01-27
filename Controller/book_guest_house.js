const GuestHouseApplication = require ('../Models/guest_house_application');
const Guest = require ('../Models/guest_house');
const getGuestHouse = async (req, res) => {
    const guestHouse = await Guest.findOne ({room_numbers : {$exists : true, $not : {$size : 0}}});
    if (guestHouse.length > 0) {
        guest_room_details = guestHouse;
        const user_details = req.user;
        const {arrival_date, departure_date} =  req.body; 
        const room_number = guestHouse.room_numbers[0];
        new GuestHouseApplication ({
            user_details,
            guest_room_details,
            room_number,
            arrival_date,
            departure_date,
        }).save ((err, result) => {
            if (result) {
                Guest.updateOne ({_id : guestHouse._id}, {$pop : {room_numbers : -1}});
                res.status (200).json ({message : "Guest House Allocated Sucessfully"});
            }
            else {
                res.status(400).json ({message : "Guest House Not Allocated"});
            }
        })
    }
    else {
        // to be implemented later 
    }
}

module.exports=getGuestHouse;