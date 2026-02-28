const express = require("express");
const router = express.Router();

const jwt = require('jsonwebtoken'); // Enable JSON Web Tokens

const tripsController = require("../controllers/trips");
const authController = require("../controllers/authentication");

// Method to authenticate our JWT
function authenticateJWT(req, res, next) {
  console.log('In Middleware');

  const authHeader = req.headers['authorization'];
  console.log('Auth Header: ' + authHeader);

  if (authHeader == null) {
    console.log('Auth Header Required But NOT PRESENT!');
    return res.sendStatus(401);
  }

  let headers = authHeader.split(' ');
  if (headers.length < 1) {
    console.log('Not enough tokens in Auth Header: ' + headers.length);
    return res.sendStatus(501);
  }

  const token = authHeader.split(' ')[1];

  if (token == null) {
    console.log('Will Return Token!');
    return res.sendStatus(401);
  }

  const verified = jwt.verify(token, process.env.JWT_SECRET, (err, verified) => {
    if (err) {
      return res.status(401).json('Unauthorized');
    }

    req.auth = verified; // Set the auth param to the decoded object
    next(); // We need to continue or this will hang forever
  });
}

router
  .route("/register")
  .post(authController.register);

// define route for login endpoint
router
  .route("/login")
  .post(authController.login);

router
  .route("/trips")
  .get(tripsController.tripsList)
  .post(authenticateJWT, tripsController.tripsAddTrip);

router
  .route("/trips/:tripCode")
  .get(tripsController.tripsFindByCode)
  .put(authenticateJWT, tripsController.tripsUpdateTrip);

module.exports = router;