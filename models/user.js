const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() { 
  const authtoken = jwt.sign({ _id: this._id, name : this.name }, config.get('jwtPrivateKey'));
  return authtoken;
}

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', userSchema);

function validateUser(user) {

  const schema = {
    name: Joi.string().min(5).max(55).required(),
    email: Joi.string().min(5).max(55).required().email(),
    password: Joi.string().min(8).max(55).required()
  };
  return Joi.validate(user, schema);
}

exports.User = User; 
exports.validate = validateUser;