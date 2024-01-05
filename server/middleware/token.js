const jwt=require('jsonwebtoken')
require('dotenv').config()


const verifyToken=(req,res,next)=>{
    const {email}=req.query
    const token=req.headers.authorization


    if(token){
        console.log('Token found');
        jwt.verify(token,process.env.jwtSecret,(err,user)=>{
            if(err){
                return res.status(401).json({message:"Not authorized"})
            }else{
                if(user){
                    if(user.email==email){
                        console.log('User is verified');
                        next()
                    }
                    else{
                        return res.status(401).json({message:"Not authorized"}) 
                    }
                }
                else{
                    return res.status(401).json({message:"Not authorized"}) 
                }
                
            }
        })

    }
    else{
        console.log('Missing token');
        return res.status(401).json({message:'Not authorized. Missing token'})
    }
}

module.exports=verifyToken