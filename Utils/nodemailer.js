const nodemailer=require('nodemailer');


let transporter = nodemailer.createTransport({
    service:'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user:'hosteer177@gmail.com',
        pass:process.env.EMAIL_PASSWORD
    },
    tls:{rejectUnauthorized:false}
});

function verificationMailGen(token,email){

    const CLIENT_URL=process.env.CLIENT_URL;
    let verficationMail = {
        from : 'hosteer177@gmail.com',
        to:email,
        subject: "Verification mail from Hosteer",
        text : "Welcome to Hosteer ! ",
        html : `
        <h2>Please click on the given link to activate your account</h2>
        <a href="${CLIENT_URL}/authentication/${token}">Click Here to verify</a>
        <p>Pls do it within 20 min</p>
        <p>If the above link is not working then browse to ${CLIENT_URL}/authentication/${token} </p>
        `
    }
    return verficationMail;
}

module.exports={
    transporter,
    verificationMailGen
}