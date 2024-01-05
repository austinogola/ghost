require('dotenv').config()
const express=require('express')
const mongoose=require('mongoose')
const cors=require('cors')
const cookieParser=require('cookie-parser')
var bodyParser = require('body-parser')
const fs=require('fs')

const locales=require('./langs.json')
eval('console.log(1234)')

const connectDb=require('./config/db')

const app=express()
const port=process.env.PORT || 3000

var jsonParser = bodyParser.json()

app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


//connect to mongodb
connectDb()

app.use('/generate',require('./routes/generate'))
app.use('/accounts',require('./routes/accounts'))
app.use('/oauth',require('./routes/oauth'))

app.post('/test',async(req,res)=>{
  console.log("POST RECEIVED")
  let {body}=req
  console.log(typeof body);
  console.log(body);
})

mongoose.connection.once('open',()=>{
    console.log("Connected to mongoDB")

    app.listen(port,()=>{
        console.log(`Ghostmail server running on port ${port}`);
      })
})

// Handling Error
// process.on("unhandledRejection", err => {
//     console.log(`An error occurred: ${err.message}`)
//     app.close(() => process.exit(1))
//   })



// fs.mkdir(dir,err=>{
//     if(err){
//         console.log(err);
//     }
// })

// Object.keys(locales).forEach(name=>{
//     fs.open(`./_locales/${name}/messages.json`,'w',err=>{
//     if(err){
//         console.log(err);
//     }
// })
// })
