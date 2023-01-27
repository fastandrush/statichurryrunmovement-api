const express = require('express');
const Router = require('express').Router();
const mongoose = require('mongoose');

const mongodb = require('../lib/mongodb/database');
const { on } = require('../model/productModel');

const item = require('../model/productModel');

Router.route('/sortall').get( async (req, res)=> {
  
  await mongodb.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Item',
    autoCreate: false
  })

  const Items = await mongoose.model('items', item);
 
  await Items.find()
    .then((response)=> {
       console.log('All items' + response)
       mongoose.connection.close()
       res.send(response)
    })
      
})

Router.route('/specificitem').post( async (req, res)=> {
   
  await mongodb.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Item',
    autoCreate: false
  })

  const Items = mongoose.model('items', item);

  await Items.find({productname: req.body.itemname, productsorttype: req.body.itemsortspecification, originator: req.body.itemoriginator})
    .then((response)=> {
        console.log(response)
        mongoose.connection.close()
        res.send(response)
    })

})
  
module.exports = Router;