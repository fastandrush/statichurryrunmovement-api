const express = require('express');
const Router = require('express').Router();

const mongoose = require('mongoose');

const item = require('../model/productModel');
const macSetItem = require('../model/macsetitemModel');

const mongodb = require('../lib/mongodb/database');

const multer = require('multer');

const storage = multer.diskStorage({ 
   destination: function(req, file, cb) {
      cb(null, '../view/public/images/macsetitemdisplaycontent/')
   },                                               
   filename: function(req, file, cb) {
     cb(null, file.originalname)
   }
})
 
const upload = multer({storage: storage})


/// marketing, get 
//mpc sets
Router.route('/set/mpcmarketing').get( async (req, res)=> {
 
   req.mpcsets = [];

   try {

   await mongodb.connect(process.env.ATLAS_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         dbName: 'Macsetitem',
         autoCreate: false
   })
   
   const marketing = await mongoose.model('macsetitems', macSetItem);
 
   await marketing.find()
    .then( async (response)=> {
      const responsedata = response
      for ( let i = 0; i < responsedata.length; i++) {
         let dataObj = {
            macsetitemnumber: response[i].macsetitemnumber,
            originator: response[i].originator,
            macsetitemproductname: response[i].macsetproductname,
            macsetitemproductprice: response[i].macsetproductprice,
            vat: response[i].vat, 
            macsetitemproductdescription: response[i].macsetproductdescription,
            macsetitemlocation: response[i].macsetitemlocation,
            macsetweight: response[i].macsetweight,
            macsetitemdisplayimage: response[i].macsetitemdisplayimage,
            macmainsetitemtype: response[i].macmainsetitemtype,
            macsetitemtype: response[i].macsetitemtype,
            items: response[i].items
         }

   
         req.mpcsets.push(dataObj)
      }
      console.log('MPC sets are loaded on the (U)ser (I)nterface')
      await mongoose.connection.close();
      res.status(200).send(req.mpcsets);  
   })
   
   }
   catch(err) {
      console.log('Error while loading get mpc set A(pplication) P(rogram) I(nterface),' + '\n' + err)
   } finally {
      req.mpcsets = [];
      return
   }

})
//all 
Router.route('/all/merchandises').get( async (req, res)=> {
  
 try {

    await mongodb.connect(process.env.ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'Item',
        autoCreate: false   
    })
     
    const Items = await mongoose.model('items', item);
      
    await Items.find()
        .then((response)=> {
          const responsedata = response;
          console.log('All marketing merchandise\'s are loaded on the (U)ser (I)nterface')
          mongoose.connection.close()
          res.status(200).send(response)
        })
       
   } catch(err) {
      console.log('Error while loading all marketing merchandises A(pplication) P(rogram) I(nterface),' + '\n' + err)
   } finally {
      return
   }
 
       
 })

/////
Router.route('/addamacsetitem').post( upload.single('macsetitemcontentdisplay'), async (req, res)=> {

   await mongodb.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'Macsetitem',
      autoCreate: false
   })


   /// compromis video upload between image item upload
   const MacSetItem = mongoose.model('Macsetitems', macSetItem);

   const newMacSetItem = new MacSetItem({
      macsetitemnumber: req.body.macsetitemnumber,
      macsetproductname: req.body.macsetname,
      macsetproductdescription: req.body.macsetdescription,
      macsetproductprice: req.body.macsetprice,
      macmainsetitemtype: req.body.macitemmainsettype,
      macsetitemtype: req.body.macitemsettype,
      originator: req.body.macsetoriginator,
      macsetitemlocation: req.body.macsetitemlocation,
      macsetweight: req.body.macsetweight,
      macsetvat: req.body.macsetvat,
      items: [],
      macsetitemdisplayimage: `../images/macsetitemdisplaycontent/${req.file.originalname}`
   })

   await newMacSetItem.save()
      .then((response)=> {
         console.log('Mac set item added')
   })
 
 res.end();    

})


async function updateMacSetItemGetProduct(req, res, next) {
  
 req.product = {};

 try {
   
   await mongodb.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'Item',
      autoCreate: false
   })

   const Item = mongoose.model('Items', item);

   await Item.find({productId: req.body.itemnumberkey})
     .then((response)=> {
        console.log(response[0])
        req.product = response[0]
        next()
     })
    
 } catch(err) {

 } finally {
  
 }
 
}

Router.route('/updatemacsetitem/').post( async (req, res) => {
  
   await mongodb.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'Macsetitem',
      autoCreate: false
   })

   const MacSetItem = mongoose.model('macsetitems', macSetItem);

   await MacSetItem.findOneAndUpdate({macsetitemnumber: req.body.macsetitemnumberkey}, 
                                    { $push: {items: req.body.product}}, function(err, data) {
                                        if (err) {
                                          console.log('Err when updating mac set item/addproduct')
                                        } else {
                                          console.log(data)
                                        }
                                     }) 
                                  
})

Router.route('/getmacsetitemss').get( async (req, res)=> {
  
   await mongodb.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'Macsetitem',
      autoCreate: false
   })

   const MacSetItem = mongoose.model('macsetitems', macSetItem);

   MacSetItem.find()
     .then((response)=> {
        console.log(response[0].items)
        res.send(response)
     })
})

module.exports = Router;
