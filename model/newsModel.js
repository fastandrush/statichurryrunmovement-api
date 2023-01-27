const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const macContents = new Schema({
   topic: String, 
   image: String,
   goal: String,
   author: String,
   date: String,
   ytlinkstatus: false,
   ytlink: String,
   sequence: {
      type: String,
      unique: true
   }
})

const popularPosts = new Schema({
   id: String,
   topic: String, 
   image: String,
   goal: String,
   author: String,
   date: String,
   ytlinkstatus: false,
   ytlink: String,
})

const mainNews = new Schema({
   topic: String,
   image: String,
   goal: String,
   author: String,
   date: String,
   sequence: Number
})

const phNews = new Schema({
   topic: String,
   image: String,
   goal: String,
   author: String,
   date: String,  
   sequence: Number
})

const videos = new Schema({
   topic: String,
   image: String,
   goal: String,
   author: String,
   date: String,
   ytvideo: String,
   sequence: Number
})

module.exports =  macContents, popularPosts, mainNews, phNews ;


