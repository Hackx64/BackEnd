const makePayment = (req,res, stripe)=>{
    
    const {amount, stripeToken} = req.body;
    if (!amount || !stripeToken)
        return res.status(400).json("Bad Request Credential for Token/Amount"); 
    try {
        stripe.charges.create({
            amount:amount*100,
            currency: 'inr',
            source: stripeToken,
            description: 'Thank you for your generous donation.'
        })
        .then((charge) => {
            res.status(200).json({message:"Payment Successful",charge});
        })
        .catch(err => res.status(500).json({message:"Server Error while processing Payment",error:err}));
    } catch(err){ 
        res.status(500).json("Internal Server Error");
    }
}



module.exports={
    makePayment
}