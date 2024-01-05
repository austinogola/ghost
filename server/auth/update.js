const Account=require('../model/account')
const User=require('../model/user')
const jwt=require('jsonwebtoken')
const verify=require('../middleware/token')
require('dotenv').config()

const updateRem=async(req,res)=>{
    console.log('Updating now')
    const {email}=req.query
    let {prompt}=req.body

    const em_acnt=await User.findOne({email})
    console.log("The account",em_acnt)
    let remaining_today=em_acnt.remaining.today-1
    let remaining_this_month=em_acnt.remaining.this_month-1
        const remaining={
        remaining:{
            today:remaining_today,
            this_month:remaining_this_month
        }
    }

    let doc = await User.findOneAndUpdate({email}, remaining);


}

module.exports=updateRem