const Joi = require('joi');
const mongoose = require('mongoose');

const Post = mongoose.model('Post', new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, 
    minlength: 30,
    maxlength: 255
  },
  desc: {
    type: String,
    required: true,
    trim: true, 
    minlength: 100,
    maxlength: 1000
  },
  _user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  postedOn: { 
    type: Date, 
    required: true,
    default: Date.now
  },
  _comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comments"
    }
  ]
  
}));

function validatePost(Post) {
  const schema = {
    title: Joi.string().min(30).max(255).required(),
    desc: Joi.string().min(100).max(1000).required(),
    _user: Joi.objectId().required()
  };

  return Joi.validate(Post, schema);
}

exports.Post = Post; 
exports.validate = validatePost;