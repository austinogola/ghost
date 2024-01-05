const mongoose=require('mongoose')

const AccountSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },           
    is_paid:{
        type:Boolean,
        default:false
    }
    
})

const Account=mongoose.model('Account',AccountSchema)

module.exports=Account