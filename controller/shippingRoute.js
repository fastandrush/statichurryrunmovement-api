const express = require('express');
const Router = require('express').Router();
const mongoose = require('mongoose');

const mongodb = require('../lib/mongodb/database');

const { JAndT, location, from } = require('../model/shippingModel');



async function addShippingRate(req, res, next) {
  
   

}

Router.route('/jandt/getshippingrate').post( async (req, res)=> {
 
   // console.log('Synced')
    console.log(req.body.weight)
   // console.log(req.body.userlocation)
   // console.log(req.body.itemlocation)
   // console.log(req.body.shippingprice)
   // console.log(req.body.weight)
   

  try {
 
    await mongodb.connect(process.env.ATLAS_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'Shipping',
            autoCreate: false
   })
      
   const JAndTShipping = mongoose.model('jandt', JAndT);
        
   const newShippingRate = new JAndTShipping({
                                               weight: req.body.weight,
                                               location: []
                                             }) 
   newShippingRate.location.push({
                                 to: req.body.userlocation,
                                 from: []                             
                                })
 
  const _location = newShippingRate.location.find((data)=> data.to === req.body.userlocation)
  const _query = (data) => data.to === req.body.userlocation;
  const _findIndex = newShippingRate.location.findIndex(_query)  
  
  _location.from.push({
                       from: req.body.itemlocation,
                       shippingprice: req.body.shippingprice
                      })

  await newShippingRate.save()
    .then((response)=> {
      console.log(response)
      console.log('Shipping rate added')
      mongoose.connection.close();
    })

  res.end()

 } catch(err) {
    console.log('Err' + err)
 } finally {
  
 }

})

Router.route('/jandt/updateshippingrate').post( async (req, res) => {

   req.shipping = null;

    try {
 
        await mongodb.connect(process.env.ATLAS_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                dbName: 'Shipping',
                autoCreate: false
       })
          
      const JAndTShipping = mongoose.model('jandt', JAndT);
            
     const shippingInfo = await JAndTShipping.findOne({weight: req.body.weight, 'location.to': req.body.userlocation, 'location.from.from': req.body.itemlocation})
        
     const _location = shippingInfo.location.find((data)=> data.to === req.body.userlocation)
     const _query = (data) => data.to === req.body.userlocation;
     const _findIndex = shippingInfo.location.findIndex(_query)  

     shippingInfo.location[_findIndex].from.push({
                                 from: req.body.itemlocation,
                                 shippingprice: req.body.shippingprice
                              })
      
     shippingInfo.save() 
       .then((response)=> {
          console.log(response)
          console.log('Updated')
        })
   
     
     } catch(err) {
        console.log('Err' + err)
     } finally {
      
     }
})

Router.route('/jandt/addshippinglocation').post( async (req, res)=> {
    try {

     await mongodb.connect(process.env.ATLAS_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'Shipping',
            autoCreate: false
    })

    const JAndTShipping = mongoose.model('jandt', JAndT);

    const shippingLocation = await JAndTShipping.findOne({weight: req.body.weight}) 
    
    shippingLocation.location.push({
                               to: req.body.userlocation,
                               from: []
                              })
  
   shippingLocation.save()
     .then((response)=> {
         console.log(response)
         console.log('Added')
     })
   


    } catch(err) {
        console.log('Err' + err)
    } finally {

    }
})

//// get J&T shipping
Router.route('/jandt/calculateshippingprice').post( async (req, res)=> {

    req.rate = undefined;
    
    try {   
    await mongodb.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'Shipping',
      autoCreate: false,
    })

    const JAndTShipping = await mongoose.model('jandt', JAndT);

    let shipping = await JAndTShipping.find({weight: {$gte: req.body.weight}})
    console.log('Shipping,' + shipping)
    let shippingto =  await shipping[0].location.find((data)=> data.to === req.body.to)
    console.log('Shipping to,' + shippingto)
    let shippingfromlocation = shippingto.from;
    console.log('Shipping from location,' + shippingfromlocation)
    let getshippingrate =  await shippingfromlocation.find((data)=> data.from === req.body.from)
    console.log('Shipping rate,' +  getshippingrate)
   
    if ( req.body.idx === 0 ) {

      let shippingData = {
             idx: req.body.idx,
            shippingrate: 0
      }
  
    
      res.send(shippingData)
  
     }
  
     if ( req.body.idx !== 0 ) {
      
      let shippingData = {
        idx: req.body.idx,
        shippingrate: getshippingrate.shippingprice
      }
      console.log(shippingData)
                                                                    
      res.send(shippingData)
  
     }
   

    } catch(err) {
       console.log('Error whilte getting shipping prices,' + ' ' + err)
    } finally {
     
    }

  })

Router.route('/').post( async (req, res)=> {
    try {
    
      await mongodb.connect(process.env.ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'Shipping',
        autoCreate: false
      })
  
      const JAndTShipping = mongoose.model('jandt', JAndT);
  
       
    } catch(err) {

    }
    finally {

    }
})
  
module.exports = Router;