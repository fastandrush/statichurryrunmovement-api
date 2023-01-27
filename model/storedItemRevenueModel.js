const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeditemrevenue = new Schema({
    storeditemrevenue: {
      notequaltoten: Boolean,
      storeditemrevenue: Number
    }
})

module.exports = storeditemrevenue;
