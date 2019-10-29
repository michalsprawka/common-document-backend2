const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');


const router = express.Router();
const mongoose = require('mongoose');
const { User  } = require('../models/user')

router.post('/', async (req,res)=>{
    const { error } = validate(req.body);
   if(error) return res.status(400).send(error.details[0].message);
  // console.log("in rea");
   let user;
    try{
    user =  await User.findOne({ email: req.body.email}).maxTimeMS(10000)//.exec(function() { console.log("some error")});
    }catch(err){
  // console.log("Waiting for user...",err);
    }
   if (!user) return res.status(400).send('Invalid email or password2');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid email or password');

    const token = user.generateAuthToken();
  // console.log("TOKEN:",token);


   

    let connectedUsers = {};
    if(user.isManager){
  //      console.log("user:  ",user)
        connectedUsers = await User.find({  groupName: user.groupName,  isManager: false }).select('-password');
   //     console.log("after connsected user execution");
    }
   
    
    try{

        user={...user._doc, connectedUsers: connectedUsers};
    user= _.omit(user,['password']);
    //console.log("user:  ",user)
    }
    catch(err){
        console.log(err);
    }
    try{
    res.send({token: token, user: user});
    }
    catch(err){
        console.log(err);
    }
   
})



function validate(req){
    const schema = {
      
        email: Joi.string().min(5).max(256).required().email(),
        password: Joi.string().min(5).max(255).required()  
    };
    return Joi.validate(req,schema);
}

module.exports =router;

// joi-password-complexity