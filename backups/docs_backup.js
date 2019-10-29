const express = require('express');
const Joi = require('joi');
const router = express.Router();
const mongoose = require('mongoose');
const { Doc, validate_d } = require('../models/doc');
const { Field, validate_f } = require('../models/field');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin')
// const asyncMiddleware = require('../middleware/async');


router.get('/',auth,async (req,res, next)=>{

   // console.log("Query:  ",  req.query);
    // const queryName = req.query.name!==undefined ? {name: req.query.name} : null;
    // console.log("queryName:  ",  queryName);
    
        // const todos = await Todo.find(queryName).find({'comments.name': 'test1111'}).sort('name');
     //   console.log("req user: ",req.user); 
        //test req usera
        const query ={};
        const pageNumber = req.query.page ;
        const pageSize = 3;

        if(Array.isArray(req.query.status)){
         //   console.log("is array");
           // try{
            // query["addedFieldSchema.groupName"]=req.user.groupName;
            query.status={$in: req.query.status };
            // var docs = await Doc.find( {"addedFieldSchema.groupName": req.user.groupName, status: {$in: req.query.status }});
         //   }
         //   catch(err) {
          //      console.log(err);
          //  }
        }
        else{
          //  console.log("is not array");
            // query["addedFieldSchema.groupName"]=req.user.groupName;
            query.status=req.query.status;
            // docs = await Doc.find({"addedFieldSchema.groupName": req.user.groupName, status: req.query.status});
        }
        if(req.query.listtype==="ownerlist"){
           // console.log("jestem w owner list")
            query.owner = req.user._id;
        }
        if(req.query.listtype==="worklist"){
         //   console.log("jestem w worker list")
            query["addedFieldSchema.worker"] = req.user._id;
        }
        if(req.query.listtype==="managerlist"){
         //   console.log("jestem w manager list")
            query["addedFieldSchema.groupName"]=req.user.groupName;
            
            if(req.query.unchoosenworker==="true"){
             //   console.log("jestem w unchoosenworker");
                //query["addedFieldSchema.worker"]= {  $exists : false }
                //UWAGA do poprawy !!!!!!!!!!
                try{
                // query.addedFieldSchema = { $elemMatch :{groupName : req.user.groupName, worker: {  $exists : false }} }
                query.addedFieldSchema = { $elemMatch :{groupName : req.user.groupName, worker: null }}
                }
                catch(err){
                    console.log(err);
                }
            }
        }
        if(req.query.search){
           // console.log("jestem w search");
            query.title = { $regex: new RegExp(req.query.search) };
        }
        // query["addedFieldSchema.groupName"]=req.user.groupName;
      //  console.log("QUERY:",query)
        const docs= await Doc.find(query)
        .skip((pageNumber-1)*pageSize)
        .limit(pageSize);
        
        // catch(err){
        //     console.log(err);
        // }
        const cnt = await Doc.find(query).count();

        // await docs.populate({ path: "addedFieldSchema"})
        //docs.count = 1;
      //  console.log("Found docs: ",docs);
        const resp = {request: docs, count: cnt };
      //  try {
       // console.log("docs 0: ",docs[0]);
      //  } catch(err){
      //      console.log(err);
      //  }
       res.send(resp);
        // console.log(req.user.isAdmin);
        // console.log("REQ:  ",req);
        
        // .populate({ path: "addedFields"})
        // .sort('name');
        // res.send(docs);  
});

router.get('/unchoosencounter',auth, async (req, res) => {
  //  console.log("in unchoosencounter");
   // console.log("req user: ",req.user); 
    const query = {};
    // query.addedFieldSchema = { $elemMatch :{groupName : req.user.groupName, worker: {  $exists : false }} }
    query.status = "PB";
    query.addedFieldSchema = { $elemMatch :{groupName : req.user.groupName, worker: null }};
    const cnt = await Doc.find(query).count();
    res.send({count: cnt});

});

// test wyszukiwania dokumentów wg kryterium pola subdokumentu (embedded)
// router.get('/description-schema/:desc',  async (req,res)=>{
//     // let f_field = await Field.find({description: req.params.desc})
//     // .select('_id')
//     // f_field = f_field.map(el => el._id)
//     // console.log(f_field);
//     const docs = await Doc.find({ "addedFieldsSchema.description" : req.params.desc })
//     .populate({ path: "addedFields"})
//     .sort('name');
//    // console.log("USER: ", req.user) TEST obiektu user dodaj odwołanie auth w prametrach
//     res.send(docs);  
// });



router.get('/detail/:id', auth,async (req,res)=>{
   const doc = await Doc.findById(req.params.id);
   if(!doc) return res.status(404).send('Object not found');
  // console.log("in detail !!!1", doc);
   res.send(doc);
});

// router.post('/',async (req,res)=>{
//     const { error } = validate_d(req.body);
//    if(error) return res.status(400).send(error.details[0].message);
       
//    let doc = new Doc({title: req.body.title, date_to: req.body.date_to, description: req.body.description});
//    try {
//    doc = await doc.save();
//    res.send(doc) 
//    }
//    catch(ex){
//     for(field in ex.errors){
//         console.log(ex.errors[field].message);
//     }
//     }
   
// });

//utworzenie dokumetu wraz z polami - (reference i embedded)
router.post('/create', auth,async (req,res)=> {
//    console.log("Body in create: ",req.body);
    const { error } = validate_d(req.body);
//    console.log("error validation: ", error.details[0].message)
    if(error) return res.status(400).send(error.details[0].message);
    // console.log("BODY: ",req.body);

       
     try {
        let doc = new Doc({...req.body, owner: req.user._id});
    
    
   
      //  console.log("doc: ",doc);
        doc = await doc.save();
        res.send(doc) 
        }
        catch(ex){

         for(field in ex.errors){
             console.log(ex.errors[field].message);
         }
         }
    
    //console.log(req.body.added[0].desc);
    
    // let promises = req.body.added.map( async function(el) {
    //     let field = new Field({ description: el.desc });
    //     field = await field.save(); //new
    //     return field; //new
         //return field.save().then(results => results._id)
    // });
    // Promise.all(promises)
    // .then(async function(results) {
    //         console.log(results)
    //         const addedFS = req.body.addedFS.map(el=> new Field(el)); //embedded
    //         let doc = new Doc({title: req.body.title, 
    //             date_to: req.body.date_to, 
    //             description: req.body.description, 
    //             addedFields: results,
    //             addedFieldsSchema: addedFS
    //         });
    // try {
    //     doc = await doc.save();
    //     res.send(doc) 
    //     }
    //     catch(ex){

    //      for(field in ex.errors){
    //          console.log(ex.errors[field].message);
    //      }
    //      }
    // req.body.addedFields.forEach(el => {
    //     console.log(el.description);
    // })

    // console.log("added table",addedFields)
    // let doc = new Doc({title: req.body.title, date_to: req.body.date_to, description: req.body.description, addedFields: addedFields});
    // try {
    //     doc = await doc.save();
    //     res.send(doc) 
    //     }
    //     catch(ex){
    //      for(field in ex.errors){
    //          console.log(ex.errors[field].message);
    //      }
    //      }
    // req.body.addedFields.forEach(el => {
    //     console.log(el.description);
     })

//zmiana tytułu
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

   

   // doc.title = req.body.title;
    res.send(doc)
});

//zmiana treści pola w sub dokumencie (embedded)

// router.put('/changefield-schema/:doc_id/:field_id',async (req,res)=>{
//     const { error } = validate_f(req.body);
//     if(error) return res.status(400).send(error.details[0].message);

//   const doc = await Doc.findById(req.params.doc_id);
//   let allCompleted = true;
//   console.log("request from added body", req.body)
//     try {
//         const field = doc.addedFieldSchema.id(req.params.field_id);
//         console.log("fieldBody: ",field.body);
//         console.log("Req body body: ",req.body.body);
//         field.body = req.body.body;
//         field.worker = req.body.worker;
//         field.completed=req.body.completed
//         for(let obj of doc.addedFieldSchema){
//             console.log("field in loop: ",obj);
//             if(!obj.completed){
//                 allCompleted=false
//             }
//         }
//         if(allCompleted){
//             doc.status="CM";
//         }
//         await doc.save();
//     }
//     catch(er){
//         console.log(er)
//     }
//     res.send(doc)
// });


//usunięcie pola w sub dokumencie (embedded)

// router.delete('/deletefield-schema/:doc_id/:field_id',async (req,res)=>{
//     // const { error } = validate_f(req.body);
//     // if(error) return res.status(400).send(error.details[0].message);

//   const doc = await Doc.findById(req.params.doc_id);
//     try {
//         const field = doc.addedFieldsSchema.id(req.params.field_id);
//         console.log("index:  ",doc.addedFieldsSchema.indexOf(field));
//         console.log("tablica field:  ",doc.addedFieldsSchema);
//         // doc.addedFieldsSchema.splice(doc.addedFieldsSchema.indexOf(field),1);
//         console.log("tablica field:  ",doc.addedFieldsSchema);
       
//         field.description = req.body.description;
//         // await doc.save();
//     }
//     catch(er){
//         console.log(er)
//     }
//     res.send(doc)
// });




//dodanie nowego pola (fielda)
// router.put('/addfield/:id',async (req,res)=>{
//     const { error } = validate_f(req.body);
//     if(error) return res.status(400).send(error.details[0].message);

//     let doc = await Doc.findById(req.params.id)
//     if(!doc) return res.status(404).send("not found");


//     let field = new Field({ description: req.body.description });
//     try {
//         field = await field.save();
//         // res.send(doc) 
//         }
//         catch(ex){
//          for(f in ex.errors){
//              console.log(ex.errors[f].message);
//          }
//          }
//    console.log("NEW field id", field._id)
//     doc.addedFields.push(field._id);
//     console.log("Doc added fields wit new", doc.addedFields)
//     try {
//         doc = await doc.save();
//         res.send(doc) 
//         }
//         catch(ex){
//             console.log("I'm in catch: ",ex);
//          for(const field in ex.errors){
//              console.log(ex.errors[field].message);
//          }
//          }

// });


router.delete('/:id',[auth, admin], async (req,res)=>{
    //console.log("USER: ",req.user)
    const doc = await Doc.findByIdAndRemove(req.params.id);
    if(!doc) return res.status(404).send("not found");

    res.send(doc);
});



module.exports = router;