const express = require("express");
const router = express.Router();
const User = require("../models/User-model");
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth)
//Not used
router.get(`/info/:id`, (req, res)=>{
    User.findById(req.params.id, (err, product) => {
      if (err) return next(err);
      res.json(product);
    });
})

module.exports = router;

