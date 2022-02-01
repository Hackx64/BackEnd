const crypto = require('crypto');
const axios = require('axios');

const mobile=(req,res)=>{
    const {mobile} = req.body;
    if(!mobile)res.status(400).json("You have not provided a mobile number");
    axios({
        method: 'post',
        url: 'https://cdn-api.co-vin.in/api/v2/auth/public/generateOTP',
        data:{
            mobile:mobile
        }
    })
    .then(function (response) {
        console.log(response);
        res.status(200).json(response.data);
    }).catch(err=>{
        console.log(err);
        res.status(403).json("This is not a CoWin registered mobile number!");
    });
};

const otp=(req,res)=>{
    const {otp,data} = req.body;
    data.otp=crypto.createHash('sha256').update(otp).digest('hex');
    //console.log(data);
    axios({
        method: 'post',
        url: 'https://cdn-api.co-vin.in/api/v2/auth/public/confirmOTP',
        data:data
    })
    .then(function (response) {
        console.log(response);
        res.status(200).json(response.data);
    }).catch((err)=>{
        console.log(err);
        res.status(403).json("Invalid OTP Number!");
    })
    //res.render('beneficiary');
};

const beneficiary = (req,res)=>{
    const {id,data} = req.body;
    const tok=data.token;
    axios({
        method: 'get',
        url: `https://cdn-api.co-vin.in/api/v2/registration/certificate/public/download?beneficiary_reference_id=${id}`,
        headers:{
            'Authorization':`Bearer ${tok}`,
            'Accept': 'application/octet-stream'
        }
    })
    .then(function (response) {
        if(response.status==200)res.status(200).json("Good You are vaccinated!!")
    })
    .catch(err=>{
        console.log(err);
        res.status(400).json("You are not yet vaccinated!");
    });
}

module.exports = {
    mobile,
    otp,
    beneficiary
}