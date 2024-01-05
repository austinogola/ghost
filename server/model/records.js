const mongoose=require('mongoose')

const RecordSchema=new mongoose.Schema({
    date:{
        type:String,
        required:true
    },
    total_attempted_requests:{
        type:Number,
    },
    total_successful_requests:{
        type:Number,
    },
    average_successful_requests:{
        type:Number,
    },
    average_free_requests:{
        type:Number,
    },
    average_paid_requests:{
        type:Number,
    },
    total_free_users:{
        type:Number
    },
    total_paid_users:{
        type:Number
    },
    to_use:{
        type:String
    }
    
})

const Record=mongoose.model('Record',RecordSchema)

module.exports=Record