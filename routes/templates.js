
const _ = require('lodash');
const express = require('express');
const Joi = require('joi');
const router = express.Router();
const mongoose = require('mongoose');
const { Template } = require('../models/template');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin')

router.get('/', async (req,res, next)=>{
   // console.log("USER: ",req.user)
    // console.log("Query:  ",  req.query);
    // const queryName = req.query.name!==undefined ? {name: req.query.name} : null;
    // console.log("queryName:  ",  queryName);
    
        // const todos = await Todo.find(queryName).find({'comments.name': 'test1111'}).sort('name');
        const templates = await Template.find().sort('name');
        console.log("Templates: ",templates);
        res.send(templates);  
});
router.get('/get-template/:name', async (req,res, next)=>{
   
         const template = await Template.findOne({name: req.params.name});
        
         const obj=_.pick(template,['title','description','date_to','addedFieldSchema']);
         console.log("Templates: ",obj);
        res.send(_.pick(template,['title','description','date_to','status','addedFieldSchema'])); 
 });
//do zrobienia
router.post('/',async (req,res)=>{
  
//     const { error } = validate_g(req.body);
//    if(error) return res.status(400).send(error.details[0].message);
   console.log("BODY: ", req.body)

   let template =  await Template.findOne({ name: req.body.name});
   if (template) return res.status(400).send('Template already registered');
   

   template = new Template( req.body );
   try {
   template = await template.save();
   res.send(_.pick(template,['title','description','date_to','status','addedFieldSchema'])); 
   }
   catch(ex){
    for(field in ex.errors){
        console.log(ex.errors[field].message);
    }
    }
   
});


module.exports = router;