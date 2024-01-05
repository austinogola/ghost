const router=require("express").Router()
// const formMail=require('../../../middleware/genMail')
const formMail=require('../middleware/genMail')
const verify=require('../middleware/token')
const updateRem=require('../auth/update')

router.post('/mail',verify,async(req,res)=>{
    console.log('Received generate request')
    
    const {email}=req.query
    if(!email){
        res.status(400).json({message:'missing email id'})
    }
    else{
        let {prompt}=req.body
        if(prompt){
            formMail(req,res,prompt)
            // updateRem(req,res)
        }else{
            console.log('Missing prompt');
            res.status(400).json({message:'invalid,missing prompt'})
        }  
        // res.status(200).json({account_status:accountPresent})
    }
    
})



module.exports=router