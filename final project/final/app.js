const express=require('express');
const mongoose=require('mongoose');
const userRoutes=require('./routes/user')
require("dotenv").config();

//for the app
const app=express();
//for the database
mongoose.connect(process.env.DATABASE,{
    useNewUrlParser:true,
    useCreateIndex:true
    })
    .then(()=>console.log("database is connected"));
    //routes middleware
    app.use("/api",userRoutes);
const port=process.env.PORT||8000;

app.listen(port,()=>{
    console.log(`server is running`);
});