require("dotenv").config();
const express=require('express')
const app=express()
const cors=require('cors');
const cox = require('./database');
app.use(cors({
    origin: "*"
}));
app.get('/',async (req,res)=>{
    try{
        res.json({data:await cox.query('SELECT name FROM sys.databases')[0]})
    }
    catch(e){
        res.json(e)
    }
})
app.listen(80,()=>{
    console.log("serveur running at port 80")
})