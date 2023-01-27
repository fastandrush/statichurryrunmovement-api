const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const macGross = new Schema({
   id: Number,
   macGross: Number,
   shippingGross: Number,
   productGross: Number,
   itemrevenue: {
      capital: Number,
      totalitemsales: Number,
      vatgross: Number
   },
   monetizationGross: Number,
   marketing: Number,
   otherBusiness: String,
   date: {
      month: String,
      day: String,
      year: Number,
      hour: Number,
      minutes: Number,
      seconds: Number
   }
})


module.exports = macGross;