const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    products: [
      {
        name: String,
        totalPreparingTime: Number,
        totalPrice: Number,
        pricePerPortion: Number,
        portions: Number,
        productId: String,
        portionPrepareTime: Number,
      }
    ],
    totalPrice:{
      type:Number,
      required: true,
    },
    customerId:{
      type: String,
      required: true
    },
    totalPrice:{
      type: Number,
      required: true
    },
    totalPreparingTime:{
      type: Number,
      required: true
    },
    status:{
      type: String,
      required: true
    }
  },
  {
    versionKey: false,
    timestamps: { createdAt: 'created_at' },
    collection: "OrdersCollection",
  }
);

module.exports = mongoose.model("Order-model", OrderSchema);
