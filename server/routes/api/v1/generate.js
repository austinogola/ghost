const router=require("express").Router()
const formMail=require('../../../middleware/genMail')


router.post('/mail',async(req,res)=>{
    let {prompt}=req.body
    if(prompt){
        //check if a valid text here
        let mailResult=await formMail(prompt)
        if(mailResult.error){
            res.status(500).json({message:'server error, please try again'})
        }else{
            let content=mailResult.message.content
            res.status(200).json({mailResult:content})
        }

    }else{
        res.status(400).json({message:'invalid,missing prompt'})
    }
})



module.exports=router