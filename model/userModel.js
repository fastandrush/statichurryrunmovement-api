const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const investor = new Schema({
    authenticated: false,
    id: {
      type: Number,  
    },
    firstname: String,
    middlename: String,
    lastname: String,
    address: {
      mc: {
         fn: {
               type: 'string',
               alias:  'macaddressfirstname'
             },
         mn: {
           type: 'string',
           alias: 'macaddressmiddlename'
         },
         ln: {
               type: 'string',
               alias:  'macaddresslastname'
             } 
      },
      isl: {
       type: 'string',
       alias: 'island'
      },
      pr: {
        type: 'string',
        alias:  'province'
      },
      cty: {
        type: 'string',
        alias:  'city'
      },
      brgy: {
        type: 'string',
        alias:  'baranggay'
      },
      st: {
        type: 'string',
        alias:  'street'
      },
      hbn: {
        type: 'string',
        alias:  'houseblocknumber'
      },
      hln: {
        type: 'string',
        alias:  'houselotnumber'
      },
      tm: {
        type: 'string',
        alias:  'trademark'
      },
    },
    cn: {
      type: 'number',
      alias:  'contactnumber'
    },
    cea: {
      type: 'string',
      alias:  'contactemailaddress'
    },
    based: false,
    hammer: false,
    scope: [],
    maccredits: {
      based: {
        type: 'number'
      },
      investment: {
        type: 'number'      
      },
      withdrawed: {
        type: 'number'
      }
    },
    invesment: {
      invested: false,
      investment: {
        goods: false,
        items: false,
      },
      lastinvested: {
        date: String,
        lastmonth: false
      }
    },
    itemsoncart: [],
    undertaker: []
})


module.exports = investor;