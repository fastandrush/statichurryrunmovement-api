const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
   population: {
       type: Number
   }
})