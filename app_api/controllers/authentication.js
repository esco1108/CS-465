const mongoose = require('mongoose');
const User = require('../models/user');
const passport = require('passport');

const register = async (req, res) => {
  // Validate message to ensure that all parameters are present
  if (!req.body.name || !req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ "message": "All fields required" });
  }

  const user = new User({
    name: req.body.name,
    email: req.body.email
  });

  user.setPassword(req.body.password);

  try {
    await user.save();
  } catch (err) {
    return res
      .status(400)
      .json(err);
  }

  const token = user.generateJWT();
  return res
    .status(200)
    .json({ token: token });
};

const login = (req, res) => {
  // Validate message to ensure that email and password are present
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ "message": "All fields required" });
  }

  // Delegate authentication to passport module
  passport.authenticate('local', (err, user, info) => {
    if (err) {
        //Error in Authentication Process
        return res
        .status(404)
        .json(err);
    }

    if (user) {
      const token = user.generateJWT();
      return res
        .status(200)
        .json({ token: token });
    } else {
      return res
        .status(401)
        .json(info);
    }
  })(req, res);
};

//Export methods that drive endpoints
module.exports = {
  register,
  login
};