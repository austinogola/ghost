const router = require("express").Router()
const verify=require('../middleware/token')

router.get("/set",verify,async (req,res)=>{
    const {email}=req.query
    const {newName,newTitle,useName,useTitle}=req.body

    



})

router.get("/save/mail",verify,async (req,res)=>{

    const {email}=req.query
    
})





module.exports=router