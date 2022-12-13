const mongoose = require("mongoose");
const passport = require("passport");
const config = require("../config/settings");
require("../config/passport")(passport);
const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../models/User-model");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Token = require("../models/Token-model");

router.post("/register", (req, res) => {
  if (!req.body.password || !req.body.email || !req.body.firstName || !req.body.lastName || !req.body.phone) {
    res.status(500).send({ success: false, message: "Error" });
  } else {
    User.findOne(
      { email: req.body.email },
      function(err, user) {
        if (user) {
           res.status(409).send({
            success: false,
            message: "Email exists"
          });
          return;
        }
        const newUser = new User({
          password: req.body.password,
          email: req.body.email,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          role: "user"
        });
        newUser.save(err => {
          console.log(err);
          if (err) {
             res.status(409).send({
              success: false,
              message: "Email exists"
            });
          }
          const token = new Token({
            _userId: newUser._id,
            token: crypto.randomBytes(16).toString("hex")
          });

          token.save(function(err) {
            if (err) {
               res.status(500).send({ msg: err.message });
               return;
            }

            res.send({registered: true})
          });
        });
      }
    );
  }
});

router.post("/confirmation", function(req, res) {
  Token.findOne(
    {
      token: req.body.token
    },

    function(err, token) {
      if (!token) {
        return res.status(409).send({
          msg:
            "We were unable to find a valid token. Your token my have expired."
        });
      }

      User.findOne({ _id: token._userId }, function(err, user) {
        if (!user) {
          return res
            .status(409)
            .send({ message: "We were unable to find a user for this token." });
        } else {
          if (user.isVerified) {
            return res.status(409).send({
              message: "This user has already been verified."
            });
          }
          user.isVerified = true;
          user.save(function(err) {
            if (err) {
              return res.status(500).send({ message: err.message });
            }
            res.json("The account has been verified. Please log in.");
          });
        }
      });
    }
  );
});

router.get("/check", (req,res)=>{
  const token = req.headers["authorization"];
  if(!token){
    res.status(401).send('Unauthorized')
  } else {
    jwt.verify(token, config.secret, (err, decoded)=>{
      if(err){
        res.status(401).send('Unauthorized')
      } else {
        req.userId = decoded;
      }
    })
  }
  User.findOne(
    {
      _id: req.userId
    },
    (err, user)=>{
      if (err) throw err;

      if (!user) {
        res.status(401).send({
          success: false,
          message: "Authentication failed. User not found."
        });
        return;
      } else {
        res.send({auth: true, user})
      }
    }
  )
})

router.post("/login", function(req, res) {
  console.log(req.body.email);
  User.findOne(
    {
      email: req.body.email
    },
    function(err, user) {
      if (err) throw err;

      if (!user) {
        res.status(401).send({
          success: false,
          message: "Authentication failed. User not found."
        });
        return;
      } else {
        user.comparePassword(req.body.password, function(err, isMatch) {
          if (!isMatch || err) {
            res.status(401).send({
              success: false,
              message: "Authentication failed. Wrong password."
            });
          } else {
            const token = jwt.sign(user._id.toJSON(), config.secret);
            req.session.user = user;
            res.json({
              token,
              user
            });
          }
        });
      }
    }
  );
});

module.exports = router;
