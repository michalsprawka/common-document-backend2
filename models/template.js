const Joi = require('joi');
const mongoose = require('mongoose');
// const { Field , FieldSchema} = require('./field');
const { User} = require('./user')
var ObjectId = mongoose.Schema.Types.ObjectId;
// const commentSchema = new mongoose.Schema({
//     name: String
// })


// const FieldSchema = new mongoose.Schema({
//     description: String,
//     body: String,
//     groupName: String,
//     completed: { type: Boolean,
//                     default: false
//                     },
   
//     worker: { type: ObjectId,
//                 ref: "User"
//             }
    // })

const ElementValidationSchema = new mongoose.Schema({
    required: Boolean,
    minLength: Number,
    date_in_future: Boolean
})

const ElementConfigSchema = new mongoose.Schema({
    type: String,
    placeholder: String,
    disabled: Boolean,
    options: [String]

})

const ElementSchema = new mongoose.Schema({
    //fieldName: String,
    label: String,
    tableName: String,
    atributeName: String,
    type: String,
    position: String,
    elementType: String,
    elementConfig: ElementConfigSchema,
    value: String,
    validation: ElementValidationSchema,
    valid: Boolean,
    visibleOnCreate: Boolean,
    editableByManager: Boolean,
    editableByWorker: Boolean
})

const TemplateSchema = new mongoose.Schema({
    name: String,
    title: ElementSchema,
    description: ElementSchema,
    date_to: ElementSchema,
    status: ElementSchema,
    addedFieldSchema: [ElementSchema]
});

const Template = mongoose.model('Template', TemplateSchema);

// function validateDoc(doc){
//     const schema = {
//         title: Joi.string().min(3).required(),
//         description: Joi.string().required(),
//        //added: Joi.array(),
//         date_to: Joi.date().greater('now'),
//         // date_to: Joi.date(),
//         addedFieldSchema: Joi.array().items(Joi.object({description: Joi.string().required(),
//            groupName: Joi.string().required(),body: Joi.string(),completed: Joi.boolean(),

//                } )),
//         owner: Joi.string(),
//         status: Joi.string()
//         // comments: Joi.array()
       
//     };
//     return Joi.validate(doc,schema);
// }

exports.TemplateSchema = TemplateSchema;
exports.Template = Template;
// exports.validate_d = validateDoc;
