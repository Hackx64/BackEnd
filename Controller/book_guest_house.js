const GuestHouseApplication = require ('../Models/guest_house_application');
const Guest = require ('../Models/guest_house');
const oneDay = 1000 * 60 * 60 * 24;

const getGuestHouse = (req, res) => {
    Guest.find ({room_numbers : {$exists : true, $not : {$size : 0}}}, (err, result) => {
            if (result.length > 0) {
                guest_house_details = result[0];
                const user_details = req.body.user.id;
                const {arrival_date, departure_date} =  req.body; 
                const room_number = guest_house_details.room_numbers[0];
               
                const amount = Math.ceil(Math.abs (new Date(departure_date) - new Date(arrival_date)) / oneDay) * result[0].per_day_charge;
                console.log (amount)
                new GuestHouseApplication ({
                    user : user_details,
                    guest_house_details,
                    guest_house_number : room_number,
                    arrival_date,
                    departure_date,
                    per_day_charge : result[0].per_day_charge
                }).save ((err, result) => {
                    if (result) {
                        Guest.updateOne ({_id : guest_house_details._id}, {$pop : {room_numbers : -1}}, (err, result_of_update) => {
                            if (err) {
                                res.status(400).json ({message : "Bad submission of guest house application"});
                            } 
                            else {
                                res.status (200).json ({message : "Guest House Allocated Sucessfully", amount : amount});
                            }
                        });
                    }
                    else {
                        res.status(400).json ({message : "Guest House Not Allocated"});
                    }
                })
        }
        else {
            // to be assigned on the basis of free rooms
            GuestHouseApplication.find ({"departure_date" : {$lt : new Date(req.body.arrival_date).toISOString()} }, (err, new_result) => {
                if (new_result.length > 0) {
                    const {arrival_date, departure_date} =  req.body; 
                    const amount = Math.ceil(Math.abs (new Date(departure_date) - new Date(arrival_date)) / oneDay) * new_result[0].per_day_charge;
                    new GuestHouseApplication ({
                        user : new_result[0].user,
                        guest_house_details : new_result[0].guest_house_details,
                        guest_house_number : new_result[0].guest_house_number,
                        arrival_date,
                        departure_date,
                        per_day_charge : new_result[0].per_day_charge
                    }).save ((err, inside_result) => {
                        if (err) {
                            res.status (400).json ({message : "Unsucessful allocation"});
                        }
                        else {

                            GuestHouseApplication.deleteOne ({"_id" : new_result[0]._id}, (err, in_res) => {
                                if(err) {
                                    res.status (200).json ({message : "Incorrect Allocation"});
                                    
                                }
                                else{ 
                                    res.status (200).json ({message : "Guest House Allocated Successfully", amount : amount});
                                }
                            });
                        }
                    })
                }
                else {
                    res.status (400).json ({message : "Guest House Not Vacant"});
                }
            })
        }
    });
}

module.exports={
    getGuestHouse
}