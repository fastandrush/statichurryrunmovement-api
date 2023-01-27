const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const address = new Schema({
   address: {
     mc: {
       fn: {
        type: 'string',
        alias: 'firstname'
       },
       mn: {
        type: 'string',
        alias: 'middlename'
       },
       ln: {
        type: 'string',
        alias: 'lastname'
       }
     },
     country: {
       type: 'string',
       alias: 'country'
     },
     pr: {
       type: 'string',
       alias: 'province'
     },
     cty: {
       type: 'string',
       alias: 'city'
     },
     brgy: {
       type: 'string',
       alias: 'baranggay'
     },
     st: {
       type: 'string',
       alias: 'street'
     },
     tm: {
       type: 'string',
       alias: 'trademark'
     }
   }

})

module.exports = address;