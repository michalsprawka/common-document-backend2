const express = require('express');
const Joi = require('joi');
const router = express.Router();
const mongoose = require('mongoose');
const { Doc, validate_d } = require('../models/doc');
const { Field, validate_f } = require('../models/field');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin')



router.get('/',auth,async (req,res, next)=>{


        const query ={};
        const pageNumber = req.query.page ;
        const pageSize = 3;

        if(Array.isArray(req.query.status)){
         
            query.status={$in: req.query.status };
         
        }
        else{
         
            query.status=req.query.status;
    
        }
        if(req.query.listtype==="ownerlist"){
         
            query.owner = req.user._id;
        }
        if(req.query.listtype==="worklist"){
       
            query["addedFieldSchema.worker"] = req.user._id;
        }
        if(req.query.listtype==="managerlist"){
        
            query["addedFieldSchema.groupName"]=req.user.groupName;
            
            if(req.query.unchoosenworker==="true"){
           
                try{
             
                query.addedFieldSchema = { $elemMatch :{groupName : req.user.groupName, worker: null }}
                }
                catch(err){
                    console.log(err);
                }
            }
        }
        if(req.query.search){
           
            query.title = { $regex: new RegExp(req.query.search) };
        }
       
        const docs= await Doc.find(query)
        .skip((pageNumber-1)*pageSize)
        .limit(pageSize);
        
        
        const cnt = await Doc.find(query).count();

       
        const resp = {request: docs, count: cnt };
      
       res.send(resp);
       
});

router.get('/unchoosencounter',auth, async (req, res) => {
  
    const query = {};

    query.status = "PB";
    query.addedFieldSchema = { $elemMatch :{groupName : req.user.groupName, worker: null }};
    const cnt = await Doc.find(query).count();
    res.send({count: cnt});

});




router.get('/detail/:id', auth,async (req,res)=>{
   const doc = await Doc.findById(req.params.id);
   if(!doc) return res.status(404).send('Object not found');
 
   res.send(doc);
});


router.post('/create', auth,async (req,res)=> {

    const { error } = validate_d(req.body);

    if(error) return res.status(400).send(error.details[0].message);
  

       
     try {
        let doc = new Doc({...req.body, owner: req.user._id});
 
        doc = await doc.save();
        res.send(doc) 
        }
        catch(ex){

         for(field in ex.errors){
             console.log(ex.errors[field].message);
         }
         }
    
     })


router.put('/:id',async (req,res)=>{
    
    const { error } = validate_d(req.body);

    if(error){
        console.log("ERROR: ",error);
    }
    if(error) return res.status(400).send(error.details[0].message);

    
    let doc;
    try{
    doc = await Doc.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if(!doc) return res.status(404).send("not found");
    }catch(err){
        console.log(err);
    }

    res.send(doc)
});





router.delete('/:id',[auth, admin], async (req,res)=>{
    //console.log("USER: ",req.user)
    const doc = await Doc.findByIdAndRemove(req.params.id);
    if(!doc) return res.status(404).send("not found");

    res.send(doc);
});



module.exports = router;