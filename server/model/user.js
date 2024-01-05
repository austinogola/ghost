const mongoose=require('mongoose')

const UserSchema=new mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required:true
    },

    is_paid:{
        type:Boolean,
        default:false
    },
    saved_name:{
        type:String,
    },
    saved_title:{
        type:String
    },
    to_use:{
        type:String
    },
    remaining:{
        today:{type:Number,default:10},
        this_month:{type:Number,default:300}
    },
    history:{
        type: Map,
        of: {
            attempted: { type: Number, default: 0 },
            successful: { type: Number, default: 0 },
        }
    }
    
})

const User=mongoose.model('User',UserSchema)

module.exports=User