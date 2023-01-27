const express = require('express');
const Router = require('express').Router();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongodb = require('../lib/mongodb/database');

const investor = require('../model/userModel');
const item = require('../model/productModel');

const macGross = require('../model/macGrossModel');

const storeditemrevenue = require('../model/storedItemRevenueModel');

async function updateProductStatisticsOnShare(req, res, next) {

  const items = req.body.items;

  const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  const jsDateObt = new Date();
  let currentDay = days[jsDateObt.getDay()];
  
  try {

      if ( req.body.ismacset === 'true' ) {

        await mongodb.connect(process.env.ATLAS_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          dbName: 'Item',
          autoCreate: false  
        })

        const Item = mongoose.model('items', item);

        const purchasedItem = await Item.findOne({'macset.macsetitemname': req.body.itemname});
      
        // instead using findOneAnd Update, quirred the DB only ones using the specific item,
        // raw saving of data is used, invoke purchase item // const purchase item = Model.find()
        // the raw method provided by mongoose was used instead of their build to query the items 
        // collection once and the stored item data in purchase variable was to used to save
        // the data on that specific day using find built in JS function to find the speciific 
        // user on to update the statistics on that specific day
        // ### also prefer this raw saving using anonymouse function stored in a variable 
        // to find out if there's already user who bought this item on a specific defined time span
        // also only save the purchase variable once intead of saving the data inside callback then
        // if the data is undefined the use of using a promise function inside a callback will be used 
        // and using the save function will be used again

        // getting data's and saving, updating, deleting is a raw method provided and executed
        // in the mongoose documentation and nothing says that it will affect executions execpt 
        // on caching and using sub documents to filter fields
        const findOutIfBoughtByUser = await purchasedItem.isboughtfrom.find((data, idx)=> data.macuser === req.body.macuser && data.productname === req.body.itemname);
    
       if ( findOutIfBoughtByUser === undefined ) {     
        await purchasedItem.isboughtfrom.push({
                                     macuser: req.body.macuser,
                                     productname: req.body.itemname,
                                     province: 'Davao Del Sur',
                                     city: 'Davao city',
                                     baranggay: 'Maa',
                                     daysstatistics: {
                                       Sun: 0,
                                       Mon: 0,
                                       Tue: 0,
                                       Wed: 0,
                                       Thu: 0,
                                       Fri: 0,
                                       Sat: 0
                                     }
                                        }) 
         await purchasedItem.save()
           .then((response)=> {
              console.log('Added')
              next()
            })
     
       }
 

       if ( findOutIfBoughtByUser !== undefined ) {

          const data = purchasedItem.isboughtfrom.find((data)=> data.macuser === req.body.macuser && data.productname === req.body.itemname)
          const _query = (data) => data.macuser === req.body.macuser && data.productname === req.body.itemname;
          const _findIndex = purchasedItem.isboughtfrom.findIndex(_query)
  
          // obj entries and a obj may work but prefer to use switch
          switch(currentDay) {
            case 'Sunday':
              purchasedItem.isboughtfrom[_findIndex].daysstatistics['Sun'] = purchasedItem.isboughtfrom[_findIndex].daysstatistics['Fri'] + 1;
              await purchasedItem.save()
                  .then((response)=> {
                      console.log(response)
                      console.log('Item statistics appended')
                      mongoose.connection.close()
                      next()
                  })
            break;
            case 'Monday':
              purchasedItem.isboughtfrom[_findIndex].daysstatistics['Mon'] = purchasedItem.isboughtfrom[_findIndex].daysstatistics['Fri'] + 1;
              await purchasedItem.save()
                  .then((response)=> {
                      console.log(response)
                      console.log('Item statistics appended')
                      mongoose.connection.close()
                      next()  
                  }) 
            break;
            case 'Tuesday':
              purchasedItem.isboughtfrom[_findIndex].daysstatistics['Tue'] = purchasedItem.isboughtfrom[_findIndex].daysstatistics['Fri'] + 1;
              await purchasedItem.save()
                  .then((response)=> {
                      console.log(response)
                      console.log('Item statistics appended')
                      mongoose.connection.close()
                      next()
                  })
            break;
            case 'Wednesday':
              purchasedItem.isboughtfrom[_findIndex].daysstatistics['Wed'] = purchasedItem.isboughtfrom[_findIndex].daysstatistics['Fri'] + 1;
              await purchasedItem.save()
                  .then((response)=> {
                      console.log(response)
                      console.log('Item statistics appended')
                      mongoose.connection.close()
                      next()
                  })
            break;
            case 'Thursday':
              purchasedItem.isboughtfrom[_findIndex].daysstatistics['Thu'] = purchasedItem.isboughtfrom[_findIndex].daysstatistics['Fri'] + 1;
              await purchasedItem.save()
                  .then((response)=> {
                      console.log(response)
                      console.log('Item statistics appended')
                      mongoose.connection.close()
                      next()
                  }) 
            break;
            case 'Friday':
              purchasedItem.isboughtfrom[_findIndex].daysstatistics['Fri'] = purchasedItem.isboughtfrom[_findIndex].daysstatistics['Fri'] + 1;
              await purchasedItem.save()
                  .then((response)=> {
                      console.log(response)
                      console.log('Item statistics appended')
                      mongoose.connection.close()
                      next()
                  })
            break;
            case 'Saturday':
              purchasedItem.isboughtfrom[_findIndex].daysstatistics['Saturday'] = purchasedItem.isboughtfrom[_findIndex].daysstatistics['Fri'] + 1;
              await purchasedItem.save()
                  .then((response)=> {
                      console.log(response)
                      console.log('Item statistics appended')
                      mongoose.connection.close()
                      next()
                  })
            break;
          }
        
        } 


      if ( req.body.ismacset === 'false' ) {
        console.log('False')
      }
  
    }

 
    } catch(err) {
     console.log('err' + err)
  } finally {
    
  }

}

async function spreadShare(req, res, next) {
 
  const vat = Number(req.body.itemrevenue);
  req.session.storeVat = 0;

  await mongodb.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Investor',
    autoCreate: false  
  })

  const Macuser = mongoose.model('investors', investor);
  const StoredItemRevenue = mongoose.model('storeitemrevenues', storeditemrevenue);

  const lastpersononearth = await Macuser.find({isfrombracket: true, parent: false});
  const newStoredItemRevenue = await StoredItemRevenue.find();

  const itemrevenueShare = vat / lastpersononearth.length;

  if ( itemrevenueShare > 10 ) {
 
    await Macuser.updateMany({isfrombracket: true, parent: false}, 
      {$inc: {'maccredits.lastpersononearth': itemrevenueShare}}
       ,function(err, macuser){
         if (err) {return console.log(err)}
         console.log(macuser)
         console.log('Share compromised')
         mongoose.connection.close()
         next()
       });
   
  }

  if ( itemrevenueShare < 10 ) {
    console.log('Store')
  }
 
}


async function compromiseSalesStatistics(req, res, next) {
 
  try {

    await mongodb.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'Macgross',
      autoCreate: false  
    })
  
    const Macgross = mongoose.model('grosses', macGross);

    const apprehendSalesStatisticsData = await Macgross.find()

    apprehendSalesStatisticsData.map( async (data)=> {
      data.itemrevenue.totalitemsales = Number(data.itemrevenue.totalitemsales) + Number(req.body.itemsales); 
      data.itemrevenue.vatgross = Number(data.itemrevenue.vatgross) + Number(req.body.itemrevenue);
      await data.save()
           .then((response)=> {
             console.log(response)
             mongoose.connection.close()
             console.log('ITEM SALES STATISTICS COMPROMISED')
             next()
           })
    })
  
    console.log(apprehendSalesStatisticsData)

  } catch(err) {
    console.log(err)
  } finally {
    
  }

}

Router.route('/gross/items').post( updateProductStatisticsOnShare, spreadShare, compromiseSalesStatistics, async (req, res, next)=> {
  
  console.log('Shared')
  mongoose.connection.close();
  res.end()

});

////// this route was intented to add macgross data on DB
Router.route('/dummy/gross').post(  async (req, res)=> {
    try {
 
      await mongodb.connect(process.env.ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'Macgross',
        autoCreate: false  
      })
    
      const Macgross = mongoose.model('gross', macGross);

      const macgross = new Macgross({
                                     id: 1,
                                     macGross: 0,
                                     shippingGross: 0,
                                     productGross: 0,
                                     itemrevenue: {
                                       capital: 0,
                                       totalitemrevenue: 0,
                                       vatgross: 0
                                     },
                                     monetizationGross: 0,
                                     marketing: 0,
                                     otherBusinesses: 0,
                                     date: {
                                       month: 'Jan',
                                       day: 01,
                                       year: 0000,
                                       hour: 01,
                                       minutes: 01,
                                       seconds: 01
                                     } 
                                    })

    macgross.save()
       .then((response)=> {
         console.log(response)
         console.log('saved')
       })

      res.end();

    } catch(err) {
      console.log("err")
    } finally {

    }
    
})


module.exports = Router;