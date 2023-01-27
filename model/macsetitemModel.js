const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const macSetItem = new Schema({
    macsetitemnumber: Number,
    macsetproductname: String,
    macsetproductdescription: String,
    macsetproductprice: Number,
    shippingprice: Number, 
    macsetitemdisplayimage: String,
    macmainsetitemtype: String,
    macsetitemtype: String,
    macsetitemlocation: String,
    macsetweight: String,
    originator: String,
    vat: Number,
    items: []
});


module.exports = macSetItem;