const Joi = require("joi");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

/*
-----------------
Login
----------------
Method - POST
EndPoint - /api/users/login
Request Body - @email @password
*/
router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) return res.status(400).send({ error: error.details[0].message });
    let user = await User.findOne({ email: req.body.email });
    if (!user)
    return res.status(400).send({ error: "Invalid email or password." });
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword)
    return res.status(400).send({ error: "Invalid email or password." });
    const token = user.generateAuthToken();
    res.send({ jwttoken: token, name : user.name });
  } catch (ex) {
    res.send(ex);
  }
 
});

function validate(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(req, schema);
}

module.exports = router;
