const Joi = require('joi');
const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
    name: {type: String,
        // unique: true
    }
    
    
    
})

const Group = mongoose.model('FieldGroup', GroupSchema);

function validateGroup(group) {
    const schema = {
        name: Joi.string().min(3).required(),
    };
    return Joi.validate(group,schema);
}

exports.GroupSchema = GroupSchema;
exports.Group = Group;
exports.validate_g = validateGroup;