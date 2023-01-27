const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const mainNews = new Schema({
   province: String,
   city: String,
   baranggay: String,
   population: String
})


module.exports = addressScopePopulation;