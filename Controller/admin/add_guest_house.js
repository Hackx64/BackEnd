const Guest = require ('../../Models/guest_house');


const addGuestHouse = (req, res) => {
    const {name, address, per_day_charge} = req.body;
    const institute = req.body.user.institute;
    Guest.find ({'name' : name}, (err, result) => {
        if (result.length) {
            res.status (400).json ({message : "Hostel with same name already exists"});
        }
        else {
            new Guest ({
                institute,
                name, 
                address,
                per_day_charge
            }).save ((err, new_result) => {
                if (err) {
                    res.status (400).json ({message : "Problem in saving guest house"});
                }
                else {
                    res.status (200).json ({message : "New Guest House added successfully"});
                }
            })
        }
    })
}

module.exports = {
    addGuestHouse
}