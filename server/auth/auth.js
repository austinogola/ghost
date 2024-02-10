const Account=require('../model/account')
const User=require('../model/user')
const jwt=require('jsonwebtoken')
require('dotenv').config()

const register=async(req,res,next)=>{
    console.log('Registering in');

    return new Promise((resolve,reject)=>{
        const {email}=req.query
        try{
            Account.create({
                email,
            })
            .then(account=>{
                let today=new Date()
                let todayString=`${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`
                
                const maxAge = 3 * 60 * 60;
                const {chrome_id,email}=account
                let userObject={
                    email,is_paid:false,saved_name:'',saved_title:'',to_use:'',
                    remaining:{today:10,this_month:300}
                }
                let history={}
                history[todayString]={attempted:0,successful:0}
                userObject.history=history
                User.create(userObject)

                const token=jwt.sign(
                    {chrome_id,email},
                    process.env.jwtSecret,
                    {
                        expiresIn:maxAge
                    }
                )
                // res.cookie('ghostToken',token,{
                //     httpOnly:true,
                //     maxAge:maxAge*1000
                // })
                res.status(200).json({
                    message:'account successfully added',
                    account,
                    ghostToken:token
                })
            })
        }
        catch(err){
            res.status(401).json({
                message: "User not successfully created",
                error: err.message,
              })
        }
    })
    
}

const login=async(req,res,next)=>{
    console.log('Logging in');
    const {email}=req.query

    try{

        const maxAge = 3 * 60 * 60;

        const token=await jwt.sign(
            {email},
            process.env.jwtSecret,
            {
                expiresIn:maxAge
            }
        )

        // res.cookie('ghostToken',token,{
        //     httpOnly:true,
        //     maxAge:maxAge*1000
        // })
        res.status(200).json({
            massage:'User successfully logged in',
            user:{email},
            ghostToken:token
        })

    }
    catch(err){
        res.status(400).json({
            message:err.message
        })
    }
}

const check=async(email)=>{
    return new Promise(async(resolve,reject)=>{
        const em_acnt=await Account.findOne({email})

        if(em_acnt){
            console.log('Email id found')
            resolve (true)
        }
        else{
            resolve (false)
        }
    })
    
}

const checkUsage=async(req,res)=>{
    const {email}=req.query

    console.log('Checking for',email);

    try{
        User.findOne({email})
        .then(resp=>{
            console.log(resp);
            if(resp.is_paid){
                res.status(200).json({
                    type:'pro',
                    allow:true
                })
            }
            else{
                const {remaining}=resp
                const remainingToday=remaining.today>0

                if( remainingToday && remaining.this_month>0){
                    console.log('STILL REMAINS');
                    res.status(200).json({
                        type:'free',
                        allow:true,
                    })
                }
                else{
                    console.log('NON REMAINS');
                    res.status(200).json({
                        type:'free',
                        allow:false,
                        reason:remainingToday?'month':'today'
                    })
                }
                
            }
           

        })
        .catch(err=>{
            res.status(400).json({
                message:'error verifying user stats',
                error:err.message
            })
        })

        // acc.exec((err,account)=>{
        //     if(err){
        //         if(err){
        //             console.log("error: " + err);
        //             res.status(400).json({
        //                 message:'error verifying user stats',
        //                 error:err.message
        //             })
        //         }
        //         else{
        //             if(account){
        //                 res.status(200).json({
        //                     message:'user found',
        //                     user:account
        //                 })
        //             }
        //         }
        //     }
        // })
    }
    catch(err){
        res.status(400).json({
            message:'error verifying user stats',
            error:err.message
        })
    }
}




module.exports={register,check,login,checkUsage}