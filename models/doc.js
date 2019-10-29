const Joi = require('joi');
const mongoose = require('mongoose');
// const { Field , FieldSchema} = require('./field');
const { User} = require('./user')
var ObjectId = mongoose.Schema.Types.ObjectId;
// const commentSchema = new mongoose.Schema({
//     name: String
// })


const FieldSchema = new mongoose.Schema({
    description: String,
    body: String,
    groupName: String,
    completed: { type: Boolean,
                    default: false
                    },
   
    worker: { type: ObjectId,
                ref: "User"
            }
    
})
const DocSchema = new mongoose.Schema({
    templateName: {
        type: String,
        required: true,
        
    },
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    description: {
        type: String,
        //required: true,
       // minlength: 5,
        //maxlength: 50
    },
    date: {
        type: Date,
        default: Date.now
    },
    date_to: {
        type: Date,
        // validate: {validator: function(v){
        //     console.log("date:  ",new Date(v));
        //     return new Date(v) > new Date();
        // },
        // message:  'Date must biein future'
        // },
        default: new Date().setDate(new Date().getDate() + 3)
    },
    status: {
        type: String,
        required: true,
        enum: ["PB", "PR","CL","CM"] //Project, Public, completed, closed
    },
    // addedFields : [{
    //                 type: ObjectId,
    //                 ref: "Field"}],
    addedFieldSchema: [FieldSchema],
    owner : {
        type: ObjectId,
        ref: "User"
    }

    // comments: [commentSchema],
   
});

const Doc = mongoose.model('Doc', DocSchema);

function validateDoc(doc){
    const schema = {
        templateName:Joi.string().required(),
        title: Joi.string().min(3).required(),
        description: Joi.string().required(),
       //added: Joi.array(),
       // date_to: Joi.date().greater('now'),
        date_to: Joi.date(),
        // date_to: Joi.date(),
        addedFieldSchema: Joi.array().items(Joi.object({description: Joi.string().required(),
           groupName: Joi.string().required(),body: Joi.string().allow(""), worker: Joi.string().allow(null), completed: Joi.boolean(),

               } )),
        owner: Joi.string(),
        status: Joi.string()
        // comments: Joi.array()
       
    };
    return Joi.validate(doc,schema);
}

exports.DocSchema = DocSchema;
exports.Doc = Doc;
exports.validate_d = validateDoc;
