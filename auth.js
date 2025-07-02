const express=require('express');
const bodyParser=require('body-parser');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const pool = require('./config/db');
require("dotenv").config();
const app=express.Router();

app.post("/register",async(req,res)=>{
    const {username,password,role}=req.body
    const hashedPassword=await bcrypt.hash(password,10)
    try{
        await pool.query("INSERT INTO users (username,password,role) VALUES ($1,$2,$3)",[username,hashedPassword,role||"staff"])
        console.log(`user created with username ${username} and password ${password} `)
        res.status(201).json({message:"User Created"})

    }catch(err){
        res.status(500).json({error:err.message})
    }
})

app.post("/login",async(req,res)=>{
    const {username,password}=req.body
    console.log("Incoming login:", username, password);

    const result=await pool.query('select * from users where username=$1',[username])
    // console.log(result)

    if(result.rows.length===0){
        return res.status(400).json({error:"Invalid Credientials"})
    }
    const user=result.rows[0]
    console.log("DB user result:", user);
    
    const valid=await bcrypt.compare(password,user.password)
    if(!valid){
        return res.status(401).json({error:"Wrong Password"})
    }
    // console.log(process.env.JWT_SECRET_KEY)
    const token=jwt.sign({id:user.user_id,role:user.role},process.env.JWT_SECRET_KEY,{expiresIn:'1h'})
    // console.log(token)
    res.json({token})
})

module.exports=app