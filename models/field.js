const Joi = require('joi');
const mongoose = require('mongoose');
const { User} = require('./user')
var ObjectId = mongoose.Schema.Types.ObjectId;

const FieldSchema = new mongoose.Schema({
    description: String,
    body: String,
    groupName: String,
    completed: Boolean,
    worker: { type: ObjectId,
        ref: "User"
    }
   
    
    
})

const Field = mongoose.model('Field', FieldSchema);

function validateField(field) {
    const schema = {
        description: Joi.string().min(3).required(),
        groupName: Joi.string(),
        body: Joi.string(),
        completed: Joi.boolean(),
        _id: Joi.string(),
        worker: Joi.string()
        
    };
    return Joi.validate(field,schema);
}

exports.FieldSchema = FieldSchema;
exports.Field = Field;
exports.validate_f = validateField;