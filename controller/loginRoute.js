const express = require('express');
const Router = require('express').Router();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongodb = require('../lib/mongodb/database');
const axios = require('axios');

const MongoStore = require('connect-mongo');
const passport = require('passport');

const investor = require('../model/userModel');

const multer = require('multer');


async function databaseAuthenticationPersonalDetails(req, res, next) {
   
  const _firstname = req.body.persondetails.firstname;
  const _middlename = req.body.persondetails.middlename;
  const _lastname = req.body.persondetails.lastname;

   try {

      await mongodb.connect(process.env.ATLAS_URI, {
       useNewUrlParser: true,
       useUnifiedTopology: true,
       dbName: 'Investor',
       autoCreate: false
      })
   
      const User = await mongoose.model('investors', investor)
   
      await User.findOne({ firstname: _firstname, 
                        middlename: _middlename, 
                        lastname: _lastname 
                     })
        .then((response)=> {
            if (response) {
              console.log('Registered user found:' + '\n' + '\n' + response)
              req.mpcholder = response;         
            } else {
               console.log('No user')
               res.status(200).send('Registered user found:' + 'Zero in database')
            }
        })
   
      } catch(err) {
          console.log('Login attempt error,' + err)
      } finally {
        await mongoose.connection.close()
        next()
      }

}

Router.route('/login').post( databaseAuthenticationPersonalDetails, async (req, res, next) => {
  
  const $mobileidnumber = req.mpcholder._id;
  const $slicedmobileidnumber = $mobileidnumber.toString().slice(0,25);
  res.status(200).send($slicedmobileidnumber);

});

Router.route('/usersession/').post( async (req, res) => {
  //req.session.user = req.params.fn;
  console.log(req.sessionID)
  res.end()
})


module.exports = Router;