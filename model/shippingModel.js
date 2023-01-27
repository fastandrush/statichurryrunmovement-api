const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const from = new Schema({from: String, shippingprice: String});

const location = new Schema({ to: String, from: [from]});     

const JAndT = new Schema({
   weight: Number,
   location: [location]    
})

module.exports = { JAndT, location, from };