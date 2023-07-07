const express=require('express')
const routes = require('./Routes/routes')
const userModel = require('./Model/userModel');
const oemSpecsModel=require("./Model/oemSpecsModel")
const inventModel=require("./Model/inventModel")
const cors=require('cors');
const dotenv = require("dotenv");
const db=require('./db')
dotenv.config();

const app=express();
app.use(express.json())
app.use(cors())


const port=process.env.PORT || 5000

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.use('/api', routes)

app.listen(port, ()=>{
    console.log("server is running on port 5000")
})