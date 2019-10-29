
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth =  require('../middleware/auth');
const admin = require('../middleware/admin')
const router = express.Router();
const mongoose = require('mongoose');
const { User, validate } = require('../models/user')

router.get('/me',auth, async (req,res)=>{
   console.log("req user:  ",req.user);
   let selectedUser = await User.findById(req.user._id).select('-password');
   console.log(selectedUser);
   let connectedUsers = {};
   if(selectedUser.isManager){
      console.log("in update sel is manager");
   connectedUsers = await User.find({  groupName: req.user.groupName,  isManager: false });
   }
   // const response = Object.assign({}, selectedUser._doc, {connectedUsers: connectedUsers});
   const response = { ...selectedUser._doc, connectedUsers: connectedUsers }
   console.log("resp:  ", response);

   res.send(response);
})

router.post('/', async (req,res)=>{
    const { error } = validate(req.body);
   if(error) return res.status(400).send(error.details[0].message);

   let user =  await User.findOne({ email: req.body.email});
   if (user) return res.status(400).send('User already registered');
   user = new User(_.pick(req.body, ['name','email','password','isAdmin','isManager','groupName']));
   const salt = await bcrypt.genSalt(10 );
   user.password = await bcrypt.hash(user.password, salt);

   await user.save();

  
   const token = user.generateAuthToken();
   res.header('x-auth-token', token).send( _.pick(user,['_id','name','email','isAdmin','isManager','groupName']));

    
})

router.get('/',async (req,res, next)=>{
  
       const users = await User.find().sort('name');
       res.send(users);  
});

router.get('/get-users-in-group/:groupname', async (req,res)=>{
 
   try{
   const users = await User.find({ groupName: req.params.groupname })
   res.send(users)
   } catch(err){
       console.log(err)
   }
  

})

router.delete('/deleteuser/:id',[auth], async (req,res)=>{
   console.log("USER: ",req.user)
   const user = await User.findByIdAndRemove(req.params.id);
   if(!user) return res.status(404).send("not found");

   res.send(user);
});

module.exports =router;

// joi-password-complexity