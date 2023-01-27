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


async function handleDBAuthentication(req, res, next) {
   
   try {

      await mongodb.connect(process.env.ATLAS_URI, {
       useNewUrlParser: true,
       useUnifiedTopology: true,
       dbName: 'Investor',
       autoCreate: false
      })
   
      const User = mongoose.model('investors', investor)
   
      await User.find({firstname: req.body.fn, middlename: req.body.mn, lastname: req.body.ln})
        .then((user)=> {
            if (user) {
              console.log(user)
                 next()         
            } else {
                 console.log('No user')
                 return;
            }
        })
   
      } catch(err) {
          console.log('1' + err.message)
      } 

}

Router.route('/authenticate/validate').post(  handleDBAuthentication, async (req, res) => {
  
  console.log(req.body.fn)
  console.log('Executed')

  res.end();

});

Router.route('/usersession/').post( async (req, res) => {
  //req.session.user = req.params.fn;
  console.log(req.sessionID)
  res.end()
})


module.exports = Router;