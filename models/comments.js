const Joi = require('joi');
const mongoose = require('mongoose');

const Comments = mongoose.model('Comments', new mongoose.Schema({
  comment: {
    type: String,
    required: true,
    trim: true, 
    minlength: 10,
    maxlength: 255
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  CommentsedOn: { 
    type: Date, 
    required: true,
    default: Date.now
  }
  
}));

function validateComments(Comments) {
  const schema = {
    comment: Joi.string().min(10).max(255).required(),
    _user: Joi.objectId().required()
  };

  return Joi.validate(Comments, schema);
}

exports.Comments = Comments; 
exports.validateComments = validateComments;