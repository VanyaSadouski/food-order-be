const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    time: {
      type: Number,
      required: true
    },
    anotherOrdersRemainingTime:{
      type: Number,
    },
    price: {
      type: Number,
      required: true
    },
    image: {
      type: String,
    },
  },
  {
    versionKey: false,
    collection: "ProductsCollection"
  }
);
ProductSchema.plugin(mongoosePaginate);
const ProductModel = mongoose.model('Product-model', ProductSchema);

module.exports = ProductModel
