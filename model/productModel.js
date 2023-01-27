const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const isboughtfromobj = new Schema({
                                 macuser: {
                                     type: 'String',
                                     unique: true
                                 },
                                 productname: {
                                     type: 'string',
                                     unique: true
                                 },
                                 province: 'string',
                                 baranggay: 'string',
                                 city: 'string',
                                 daysstatistics: {
                                         Sun: Number, 
                                         Mon: Number,
                                         Tue: Number,
                                         Wed: Number,
                                         Thu: Number,
                                         Fri: Number,
                                         Sat: Number
                                 }
                                  })

const item = new Schema({
    productId: {
        type: 'number',
        unique: true
    },
    productStatisticsId:  {
        type: 'number',
        unique: true
    },
    last_two_week_statistics: false,
    present_statistics: false,
    firstweek: false,
    secondweek: false,
    productname: String,
    productprice: String,
    shippingprice: String,
    originator: String,
    capital: Number,
    s_r_p: Number,
    vat: Number,
    productdescription: String,
    productextrainformationlocation: {
        island: String,
        province: String,
        city: String,
        baranggay: String
    },
    productextrainformationdetails: [],
    ytlink: String,
    productmainselectionimages: [],
    productselectionimages: [],
    productavailablecolors: [],
    productavailablesizes: [],
    stock: Number,
    weight: String,
    shippingoptions: [],
    bought: false,
    boughtcount: Number,
    statistics: {
        sunday: Number,
        monday: Number,
        tuesday: Number,
        wednesday: Number,
        thursday: Number,
        friday: Number,
        saturday: Number
    },
    macitem: {
        set: Number,
        macsetitemname: String,
        macitemtype: String,
        ismacitem: false,
        isaset: false,
        setcount: Number
    },
    isaset: {
       isaset: false,
       setcount: Number,
    },
    productsorttype: String,
    producttype: String,
    dateproductpublished: String,
    isboughtfrom: [isboughtfromobj],
    isnowarecord: false
})

module.exports = item;