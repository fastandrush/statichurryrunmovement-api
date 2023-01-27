const express = require('express');
const Router = require('express').Router();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongodb = require('../lib/mongodb/database');

const address = require('../model/addressModel');
const investor = require('../model/userModel');


async function getProvinceCityBaranggay(req, res, next) {

  try {

     await mongodb.connect(process.env.ATLAS_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         dbName: 'Investor',
         autoCreate: false
      })

     const Address = mongoose.model('Addresses', address)

       Address.find()
          .then((response)=> {
               const province = [...new Set(response.map(item => item.address.pr))]; 
               const city = [...new Set(response.map(item => item.address.cty))]; 
               const baranggay = [...new Set(response.map(item => item.address.brgy))]; 

               req.province = province;
               req.city = city;
               req.baranggay = baranggay;
             
               next();
        })
  
      } catch(err) {
          console.log('Error whyl accesing database' + err)
          res.status(200).send('Error whyl getting information on population')
      } finally {
  
      }
  
}



Router.route('/spot').get( getProvinceCityBaranggay, async (req, res)=> {
 
    const addressScope = {
      provinces: req.province,
      cities: req.city,
      baranggay: req.baranggay
    } 

    res.status(200).send(addressScope)
      

})


module.exports = Router;