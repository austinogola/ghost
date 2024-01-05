const router = require("express").Router()
const jwt=require('jsonwebtoken')
require('dotenv').config()
const User=require('../model/user')

const auth=require('../auth/auth')
const registerAcc=auth.register
const checkAcc=auth.check
const loginAcc=auth.login
const verify=require('../middleware/token')
const checkUsage=auth.checkUsage

const registerNew=(email,name)=>{
    return new Promise((resolve,reject)=>{
        if(email){
            User.create({
                email,
                name,
            })
            .then(user=>{
                const maxAge = 3 * 60 * 60;
                const {email,name}=user
                const token=jwt.sign(
                    {email,name},
                    process.env.jwtSecret,
                    {
                        expiresIn:maxAge
                    }
                )
                resolve(token)
            })
        }
    })
    
}

const loginExisting=(email,name)=>{
    return new Promise(async(resolve,reject)=>{
        const maxAge = 3 * 60 * 60;

        const token=await jwt.sign(
            {email,name},
            process.env.jwtSecret,
            {
                expiresIn:maxAge
            }
        )

        resolve(token)
    })

}

const checkAccount=(email)=>{
    return new Promise(async(resolve,reject)=>{
        const existing=await User.findOne({email})

        existing?resolve(true):resolve(false)
    })
}





module.exports={registerNew,loginExisting,checkAccount}