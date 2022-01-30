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

function acceptMail(email){
    const CLIENT_URL=process.env.CLIENT_URL;
    let mail = {
        from : 'hosteer177@gmail.com',
        to:email,
        subject: "Hostel Status",
        html : `<h4>Your application for a hostel has been accepted!</h4>
        <h2>Please visit our website to see room details</h2>
        <a href="${CLIENT_URL}">Click Here visit</a>
        `
    }
    return mail;
}

function rejectMail(email){
    const CLIENT_URL=process.env.CLIENT_URL;
    let mail = {
        from : 'hosteer177@gmail.com',
        to:email,
        subject: "Hostel Status",
        html : `<h4>Your application for a hostel has NOT been accepted.</h4>
        <h2>Please visit our website to apply again with updated credentials</h2>
        <a href="${CLIENT_URL}">Click Here visit</a>
        `
    }
    return mail;
}

function queryReply(email,query,content){
    const CLIENT_URL=process.env.CLIENT_URL;
    let mail = {
        from : 'hosteer177@gmail.com',
        to:email,
        subject: "From The Hostel Admin",
        html : `In response to your query: <h4>${query}</h4>
        <h2>${content}</h2>
        <h6>Link to our Website</h6>
        <a href="${CLIENT_URL}">Click Here visit</a>
        `
    }
    return mail;
}
function pgapplicationreply(email,name,institute){
    const CLIENT_URL=process.env.CLIENT_URL;
    let mail = {
        from : 'hosteer177@gmail.com',
        to:email,
        subject: "Your response is recorded",
        html : `Thank You ${name} for appyling to Hosterr
        <h2>You will soon be contacted by the hostel admin of ${institute} </h2>
        <h6>Link to our Website</h6>
        <a href="${CLIENT_URL}">Click Here visit</a>
        `
    }
    return mail;
}

module.exports={
    transporter,
    verificationMailGen,
    acceptMail,
    rejectMail,
    queryReply,
    pgapplicationreply
}