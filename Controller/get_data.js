const Canteens = require("../Models/canteen");



const getCanteen = async (req,res)=>{
    try {
        const d = new Date();
        let s = d.getHours()+":"+d.getMinutes();
        const student = req.user;
        const institute = student.institute;
        const canteens = await Canteens.find({institute:institute,start:{$lte:s},end:{$gte:s}});
        res.status(200).json(canteens);
    } catch (error) {
        res.status(400).json({msg:"Could not find canteens",error});
    }
}

module.exports={
    getCanteen
}

