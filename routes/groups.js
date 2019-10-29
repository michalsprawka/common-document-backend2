const express = require('express');
const Joi = require('joi');
const router = express.Router();
const mongoose = require('mongoose');
const { Group, validate_g } = require('../models/group');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin')

router.get('/',auth,async (req,res, next)=>{
    console.log("USER: ",req.user)
    // console.log("Query:  ",  req.query);
    // const queryName = req.query.name!==undefined ? {name: req.query.name} : null;
    // console.log("queryName:  ",  queryName);
    
        // const todos = await Todo.find(queryName).find({'comments.name': 'test1111'}).sort('name');
        const groups = await Group.find().sort('name');
        console.log("Grupa: ",groups);
        res.send(groups);  
});
//do zrobienia
router.post('/',async (req,res)=>{
  
    const { error } = validate_g(req.body);
   if(error) return res.status(400).send({err: error.details[0].message});
   console.log("BODY: ", req.body)

   let group =  await Group.findOne({ name: req.body.name});
   if (group) return res.status(400).json({err: 'Group already registered'});
   

   group = new Group({name: req.body.name});
   try {
   group = await group.save();
   res.send(group) 
   }
   catch(ex){
    for(field in ex.errors){
        console.log(ex.errors[field].message);
    }
    }
   
});

router.delete('/deletegroup/:id',[auth], async (req,res)=>{
   // console.log("USER: ",req.user)
    const group = await Group.findByIdAndRemove(req.params.id);
    if(!group) return res.status(404).send("not found");
 
    res.send(group);
 });
 


module.exports = router;