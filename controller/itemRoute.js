const express = require('express');
const Router = require('express').Router();

const axios = require('axios');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongodb = require('../lib/mongodb/database');
const investor = require('../model/userModel');

const  { payPalRquestId } = require('../lib/paypal/paypalrequestid');

var request = require('request');

Router.route('/cartitems/myfavorite').post( async(req,res) => {
  
 
 
  try {
    
    await mongodb.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'Investor',
      autoCreate: false
     })
  
     const User = mongoose.model('investors', investor)

     User.findOneAndUpdate({firstname: req.body.user.firstname}, 
      {$push: {itemsoncart: req.body.item}}, function(err, item) {

        if (err) { return console.log('Err when saving items on cart' + err)}
        console.log('My Favaorite')
        mongoose.connection.close()
        res.send('My favorite')

      })


  } catch(err) {
    console.log('Err' + err)
  } finally {
   
  }

})


Router.route('/buy').post( async (req, res)=> {
   
  var options = {
    'method': 'POST',
    'url': 'https://g.payx.ph/payment_request',
    'headers': {
    },
    formData: {
      'x-public-key': 'pk_2187a6bb69dfd2a558a114ec63d80fec',
      'amount': '100',
      'description': 'Payment for services rendered'
    }
  };
  request(options, function (error, response) {
    if (error) throw new Error(error);

    const data = JSON.parse(response.body)
    
    console.log(data.data.checkouturl)
    res.send(data.data.checkouturl)

  });


})

Router.route('/asktoken/singletransfer').get( async (req, res)=> {

  axios({
      url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
      method: 'post',
      data: "grant_type=client_credentials",
      auth: {
         username: 'ASN0N4s32Km1pWFPwgPLK7M9wq3Kn_KkqJuZHa9lnuWVJFusJ115aq2Ac5YGSHa6a4WH5z_qy_JuxNdo',
         password: 'EK0qDQ15vGo1Hs5JRFWbink5UlUCY7vBtYVH1tT-I2G5ex0vfYxEFGbUyx70hYzNpsblXxK0RED2RKqm'
      }
    })
  .then((response)=> {
   // console.log(response.data)
      console.log(response.data.access_token)
      res.send(response.data.access_token)
  })

})

Router.route('/checkout/collectpayment').post( async (req, res)=> {


 const data = {
  intent: "CAPTURE",
  purchase_units: [
    {
      reference_id: "d9f80740-38f0-11e8-b467-0ed5f89f718b",
      amount: {
        currency_code: "USD",
        value: "100.00"
      }
    }
  ],
  payment_source: {
    paypal: {
      experience_context: {
        payment_method_preference: "IMMEDIATE_PAYMENT_REQUIRED",
        payment_method_selected: "PAYPAL",
        brand_name: "EXAMPLE INC",
        locale: "en-US",
        landing_page: "LOGIN",
        shipping_preference: "SET_PROVIDED_ADDRESS",
        user_action: "PAY_NOW",
        return_url: "http://localhost:3000/checkoutreturnpage",
        cancel_url: "https://example.com/cancelUrl"
      }
    }
  } 
 }
 
 const payPalRequestIDFirstPart = await payPalRquestId(8);
 const payPalRequestIDSecondPart = await payPalRquestId(4);
 const payPalRequestIDThirtdPart = await payPalRquestId(4);
 const payPalRequestIDFourthPart = await payPalRquestId(4);
 const payPalRequestIDFifthPart = await payPalRquestId(12);

 const config = { 
     headers: { 
        'Content-Type': "application/json",
        'Authorization': `Bearer ${req.body.token}`,
        'PayPal-Request-Id': `${payPalRequestIDFirstPart}-${payPalRequestIDSecondPart}-${payPalRequestIDThirtdPart}-${payPalRequestIDFourthPart}-${payPalRequestIDFifthPart}`  
       }
   }

   axios.post('https://api-m.sandbox.paypal.com/v2/checkout/orders', data, config)
   .then((response)=> {
       console.log(response.data)
       res.send(response.data.links[1].href)      
      // console.log(response.data.batch_header.payout_batch_id)
      // res.send(response.data.batch_header.payout_batch_id)
   })
   .catch((err)=> {
    console.log('Err' + err )
    res.send(err)
 })


})

Router.route('/checkout/capturepayment').post( async (req,res)=> {
  
  const payPalRequestIDFirstPart = await payPalRquestId(8);
  const payPalRequestIDSecondPart = await payPalRquestId(4);
  const payPalRequestIDThirtdPart = await payPalRquestId(4);
  const payPalRequestIDFourthPart = await payPalRquestId(4);
  const payPalRequestIDFifthPart = await payPalRquestId(12);
 
  const config = { 
    headers: { 
       'Content-Type': "application/json",
       'Authorization': `Bearer ${req.body.token}`,
       'PayPal-Request-Id': `${payPalRequestIDFirstPart}-${payPalRequestIDSecondPart}-${payPalRequestIDThirtdPart}-${payPalRequestIDFourthPart}-${payPalRequestIDFifthPart}`
     }
   }
  
 const data = {
  amount: {
    value: "100.00",
    currency_code: "USD"
  },  
  invoice_id: "INVOICE-123",
  final_capture: true,
  note_to_payer: "If the ordered color is not available, we will substitute with a different color free of charge.",
  soft_descriptor: "Bob's Custom Sweaters"
 }  


 axios.post(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${req.body.payerToken}/capture`, data, config)
 .then((response)=> {

     console.log(response.data)
     
    // console.log(response.data.batch_header.payout_batch_id)
    // res.send(response.data.batch_header.payout_batch_id)

 })

 .catch((err)=> {
  console.log('Err' + err )
  res.send(err)
})

})

module.exports = Router;


