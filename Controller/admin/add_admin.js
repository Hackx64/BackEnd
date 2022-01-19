const Institutes=require("../../Models/institutes");
const Admins=require("../../Models/admins");
const Hostels=require("../../Models/hostels");

const addInstitute=(req,res)=>{
    const {name, address} = req.body;
    const admin = req.user;
    Institutes.create({
        name,
        address
    },async (err,newInstitute)=>{
        if(err)
            return res.status(500).json("Error in creating new Institue in the Database");
        await Admins.findOneAndUpdate({id:admin.id},{institute:newInstitute.id});
        res.status(200).json({
            newInstitute
        });
    });
} 

const addHostel=async (req,res)=>{
    const {id} = req.user;
    const admin = await Admins.findById(id,{email:1,institute:1});
    const institute = await Institutes.findById(admin.institute);
    const {name, address, gender} = req.body;
    Hostels.create({
        name,
        gender,
        address
    },async (err,newHostel)=>{
        if(err)
            return res.status(500).json({message:"Error in creating New Hostel in the Database",error:err});
        institute.hostels.push(newHostel.id);
        await institute.save();
        res.status(200).json({
            newHostel
        });
    });
}

module.exports={
    addInstitute,
    addHostel
}