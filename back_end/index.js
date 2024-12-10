const express=require('express')
const app=express()
const cors=require('cors')
app.use(cors({
    origin: "*"
}));
app.get('/test',(req,res)=>{
    res.send("hello")
})
app.listen(4000,()=>{
    console.log("serveur running at port 4000")
})