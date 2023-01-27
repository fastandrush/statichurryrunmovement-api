const express = require('express');
const Router = require('express').Router();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongodb = require('../lib/mongodb/database');

const address = require('../model/addressModel');
const investor = require('../model/userModel');

const axios = require('axios');


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

Router.route('/singletransfer').post( async (req, res)=> {

   const data = {  
    sender_batch_header: {
        sender_batch_id: `Payouts_${req.body.senderBatchID}`,
        email_subject: "You have a payout!",
        email_message: "You have received a payout! Thanks for using our service!"
    },
    items: [
        {
            recipient_type: "EMAIL",
            amount: {
                value: "10.00",
                currency: "USD"
            },
            note: "Thanks for your patronage!",
            sender_item_id: "201403140001",
            receiver: "sb-ny6ob15554203@personal.example.com",
            notification_language: "en-US"
        }
    ]
   }  

   const config = { 
      headers: { 
         'Content-Type': "application/json",
         'Authorization': `Bearer ${req.body.token}`  
       }
   }
  
   axios.post('https://api-m.sandbox.paypal.com/v1/payments/payouts', data, config)
      .then((response)=> {
          console.log(response.data)
          console.log(response.data.batch_header.payout_batch_id)
          res.send(response.data.batch_header.payout_batch_id)
      })
      .catch((err)=> {
         console.log('Err' + err)
      })

})


module.exports = Router;