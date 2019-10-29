const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const {Group, GroupSchema} = require('./group')
var ObjectId = mongoose.Schema.Types.ObjectId;

const userSchema =  new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 256,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
      
    },
    // group : {
    //     type: ObjectId,
    //     ref: Group
    // },
    groupName: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    isManager: {
        type: Boolean,
        default: false
    }
   
});

userSchema.methods.generateAuthToken =  function() {
    const token = jwt.sign({ _id: this._id , isAdmin: this.isAdmin, groupName: this.groupName},  config.get('jwtPrivateKey'));
    return token;
}

const User= mongoose.model('User', userSchema);

function validateUser(user){
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(256).required().email(),
        password: Joi.string().min(5).max(255).required() ,
        isAdmin: Joi.boolean(),
        isManager: Joi.boolean(),
        // group: Joi.string(),
        groupName: Joi.string()
    };
    return Joi.validate(user,schema);
}


exports.User = User;
exports.validate = validateUser;
