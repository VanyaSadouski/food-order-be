const express = require("express");
const router = express.Router();
const Order = require("../models/Order-model");
const cron = require('node-cron');

cron.schedule('* * * * * *', () => {
  Order.find({} ,(err, orders = [], next) => {
    const orderInProgress = orders.filter((order)=>order.status === "IN_PROGRESS");
    orderInProgress.forEach(order => {
      const now = new Date();
      const orderDate = new Date(order.created_at);
      const difference = now.getTime() - orderDate.getTime(); // This will give difference in milliseconds
      const resultInMinutes = Math.round(difference / 60000);
      const remainingTimeCount = order.totalPreparingTime - resultInMinutes;
      if(remainingTimeCount<=0 || !remainingTimeCount){
          Order.findOneAndUpdate({_id:order._id}, {status:'DONE'}, {
            new: true
          },()=>{})
        }
    })
  })
});

const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth)
router.post("/create", (req, res)=>{
    const orderData = {
      ...req.body,
      status: 'IN_PROGRESS'
    }
    Order.create(orderData, (err, orders) => {
      if (err) return next(err);
      res.json(orders);
    });
})

router.get("/:customerId", (req, res)=>{
  const query = {
    customerId: req.params.customerId
  }
  Order.find(query ,(err, order, next) => {
    if (err) return next(err);
    res.json(order);
  });
})


router.post("/remaining-time", (req, res)=>{
  Order.find(req.body, (err, orders) => {
    if (err) return next(err);
    res.json(product);
  });
})

module.exports = router;

