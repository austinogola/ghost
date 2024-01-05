const router=require("express").Router()
const {google} = require('googleapis');
const jwt_decode = require("jwt-decode");
const userHandler=require('../config/users')
const {registerNew,loginExisting,checkAccount}=userHandler 




router.post("/",async(req,res)=>{
    let {credential}=req.body
    let decoded = jwt_decode(credential);
    let client_name=decoded.name
    let client_email=decoded.email

    let exists=await checkAccount(client_email,client_name)
    let jwtToken
    console.log(exists)
    if(exists){
        jwtToken=await loginExisting(client_email,client_name)
    }
    else{
        jwtToken=await registerNew(client_email,client_name)
    }
    console.log(jwtToken)
    const maxAge = 3 * 60 * 60;
    res.cookie('ghostToken',jwtToken,{
                    httpOnly:true,
                    maxAge:maxAge*1000
                })
    // let { tokens } = await oauth2Client.currentUser.get(credential)
    // let tok=await oauth2Client.getToken(credential)
    // console.log(tokens)
    res.status(200).json({cookie:jwtToken,maxAge:maxAge*1000})
})

router.get("/",async(req,res)=>{
    res.send('You are verified')
    console.log(req.body);
    console.log(req);
})




module.exports=router