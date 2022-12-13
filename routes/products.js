const express = require("express");
const router = express.Router();
const Product = require("../models/Product-model");
const requireAuth = require('../middleware/requireAuth');
const fs = require('fs');
const path = require('path');
const Order = require("../models/Order-model");
const multer = require('multer');
const { v4: uuidv4 }=require('uuid')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, './uploads')
  },
  filename: (req, file, cb) => {
      cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname))
  }
});

const fileFilter = (req, file, cb) => {
  if (!file) {
    cb(null, false);
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage, fileFilter, });

router.post("/", (req, res)=>{
    const {page, limit, pagination} = req.body;
    Product.paginate({},{page, limit, pagination},(err, products) => {
      if (err) return next(err);
      res.json(products)
    });
})

router.get('/image/:filename', (req, res)=>{
  const directoryPath = __basedir + '/uploads/'
	const filename = req.params.filename
  res.download(directoryPath + filename, filename, (error) => {
		if (error) {
			const err = new HttpError('Could not download the file.', 500)
			return next(err)
		}
	})

})

router.use(requireAuth)

router.route("/add").post(upload.single('image'), (req, res)=>{
  console.log(req.file);
    const productData = {
      name: req.body.name,
      description: req.body.description,
      time: req.body.time,
      price: req.body.price,
      image: req.file.filename
    }
    Product.create(productData, (err, product) => {
      console.log(err);
      res.json(product);
    });

})

router.delete("/remove/:id", (req, res)=>{
  Product.findByIdAndDelete(req.params.id, (err, product) => {
    if (err) return next(err);
    res.json(product);
  });
})

module.exports = router;

