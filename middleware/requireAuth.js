const jwt = require("jsonwebtoken");
const config = require("../config/settings");
const User = require("../models/User-model");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if(!authorization){
    return res.status(401).json({error:'Authorization token required!'})
  }

  try {
    const {_id} = jwt.verify(authorization, config.secret)
    req.user = await User.findOne({_id}).select('_id')
    next()
  } catch(err) {
    console.log(err);
    res.status(401).json({error:'Invalid token!'})
  }
}

module.exports = requireAuth;