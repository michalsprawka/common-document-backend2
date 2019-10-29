const express = require('express');
const Joi = require('joi');
const router = express.Router();
const mongoose = require('mongoose');
const { Field, validate_f } = require('../models/field');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin')

router.get('/',async (req,res, next)=>{
    // console.log("Query:  ",  req.query);
    // const queryName = req.query.name!==undefined ? {name: req.query.name} : null;
    // console.log("queryName:  ",  queryName);
    
        // const todos = await Todo.find(queryName).find({'comments.name': 'test1111'}).sort('name');
        const fields = await Field.find().sort('name');
        res.send(fields);  
});

router.post('/',async (req,res)=>{
    const { error } = validate_f(req.body);
   if(error) return res.status(400).send(error.details[0].message);
       
   let field = new Field({description: req.body.description});
   try {
   field = await field.save();
   res.send(field) 
   }
   catch(ex){
    for(field in ex.errors){
        console.log(ex.errors[field].message);
    }
    }
   
});


module.exports = router;