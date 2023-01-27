const express = require('express');
const Router = require('express').Router();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongodb = require('../lib/mongodb/database');

const item = require('../model/productModel');
const storeditemrevenue = require('../model/storedItemRevenueModel');


Router.route('/compromise').post(async (req, res)=> {
   
    try {
      
      await mongodb.connect(process.env.ATLAS_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'Storeditemrevenue',
            autoCreate: false  
      })
  
      const revenue = mongoose.model('storeditemrevenue', storeditemrevenue)
      await revenue.findOneAndUpdate({'storeditemrevenue.notequaltoten': true}, 
                                     {'storeditemrevenue.storeditemrevenue': 1},function(err, revenue) {
         if ( err ) {return console.log(err)}
         console.log(revenueData)
         console.log('Compromised')
     })
    
    } catch(err) {
        console.log(err)
    } finally {

    }

})

module.exports = Router