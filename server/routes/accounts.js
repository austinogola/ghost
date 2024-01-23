const router = require("express").Router()
const auth=require('../auth/auth')
const registerAcc=auth.register
const checkAcc=auth.check
const loginAcc=auth.login
const verify=require('../middleware/token')
const checkUsage=auth.checkUsage

router.get('/init',async(req,res)=>{
    const {email}=req.query

    if(email){
        res.status(400).json({message:'missing email'})
    }
    else{
        let accountPresent=await checkAcc(email)
        if(accountPresent){
            loginAcc(req,res)
        }else{
            registerAcc(req,res)
        }
        // res.status(200).json({account_status:accountPresent})
    }
})

router.get('/verify',verify,async(req,res)=>{
    checkUsage(req,res)
})


module.exports=router