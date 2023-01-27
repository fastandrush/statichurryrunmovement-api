const express = require('express');
const Router = require('express').Router();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const multer = require('multer');

const mongodb = require('../lib/mongodb/database');

const investor = require('../model/userModel');
const item = require('../model/productModel');

////// get all mac's
Router.route('/getallmacs').get( async (req, res)=> {
  
    let macObj = []

    try {
      await mongodb.connect(process.env.ATLAS_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: 'Investor',
            autoCreate: false
      })
      
      const User = mongoose.model('investors', investor)
       
      await User.find()
         .then((response)=> {
            console.log(response)
            for (let i = 0; i < response.length; i++ ) {      
              const data = {
                id: response[i].id,
                firstname: response[i].firstname,
                middlename: response[i].middlename,
                lastname: response[i].lastname,
                maccredits: response[i].maccredits.investment,
                authenticated: response[i].authenticated.toString(),
                children: response[i].scope
              }
              macObj.push(data)
            }
            mongoose.connection.close()
            res.send(macObj)
         })
    
   } catch(err) {
     console.log(err.message)
   } finally {
    macObj = []
   
   }
     
     

})

///// get specific mac 
Router.route('/getspecificmac').post( async (req, res)=> {
  
   let macObj = [];
  
   await mongodb.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Investor',
    autoCreate: false 
   })

   const User = mongoose.model('investors', investor)

    User.find({id: req.body.id,
               firstname: req.body.firstname, 
               middlename: req.body.middlename, 
               lastname: req.body.lastname}, function(err, response) {
             if (err) {
               console.log(err.message)
               mongoose.connection.close()
             } else {
                let data = {
                  id: response[0].id,
                  firstname: response[0].firstname,
                  middlename: response[0].middlename,
                  lastname: response[0].lastname,
                  children: response[0].children
                }
                macObj.push(data)
                res.send(macObj)   
             }
           })

macObj = []

  
})

//// calculate product summary 
function calculateProductSummary(digit1, digit2) {
  return (digit1 / digit2) * 100;
}
/// get originator product summary 
Router.route('/getproductoriginatorsummary').get( async (req, res)=> {

  req.parsedProductSummary = [];

  try {

    await mongodb.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'Product',
      autoCreate: false,
      maxPoolSize: 1
    })
  
    const Product = mongoose.model('Product', item)
  
    await Product.find()
     .then( async (response)=> {
       // perfect algoritym for watching a record in db
       const productOrigninator = response.map((data)=> data.origninator)
       const parsedProductOrigninator = [...new Set(productOrigninator)];
       // used the originator length as a bases in the function execution, it will run depending on
       // how many product originator in db
       // parsing the informations are stored in a variable expecting an array using map functions
       // pros, JS is super fast (9 lines of code with value that is already been stored), 
       // only used the mongodb seed once
       for ( let i = 0 ; i < parsedProductOrigninator.length; i++) { 

          let data = response.filter((data)=> data.origninator === parsedProductOrigninator[i]);
          const parsedProductNameData = data.map((data)=> data.productname)
          const productOriginator = data.map((data)=> data.origninator)
          const parsedProductIsBoughtStatus = data.map((data)=> data.bought)
          const findProductThatIsBought = data.filter((data)=> data.bought === true)
          const originatorProductSummary = calculateProductSummary(findProductThatIsBought.length, parsedProductNameData.length)
       
          const productSummaryObj = {
            productSummaryOriginator: productOriginator[0],
            productSummaryPointers: {
              productname: parsedProductNameData,
              productisboughtstatus: parsedProductIsBoughtStatus
            },
            productSummary: originatorProductSummary.toFixed(2)
          }
  
          req.parsedProductSummary.push(productSummaryObj)
       }

        })

   } catch(err) {
     console.log(err.message)
   } finally {
        res.send(req.parsedProductSummary)   
          req.parsedProductSummary = []
          mongoose.connection.close()
   }
      
})

// get orogonotor first week product statistics 
Router.route('/getorignatorproductstatisticsgraphsecondweek').post( async (req, res)=> {

 
  const reduceFunctionBasis = 0;
  req.singleCalculationResult = [];
 
  req.getAllSunday = [];
  req.parseAllSunday = null;
  req.AllSunday = null;

  req.getAllMonday = [];
  req.parseAllMonday = null;
  req.AllMonday = null;

  req.getAllTuesday = [];
  req.parseAllTuesday = null;
  req.AllTuesday = null;

  req.getAllWednesday = [];
  req.parseAllWednesday = null;
  req.AllWednesday = null;

  req.getAllThursday = [];
  req.parseAllThursday = null;
  req.AllThursday = null;

  req.getAllFriday = [];
  req.parseAllFriday = null;
  req.AllFriday = null;

  req.getAllSaturday = [];
  req.parseAllSaturday = null;
  req.AllSaturday = null;

  req.sendObj = [];
    
  try {

    await mongodb.connect(process.env.ATLAS_URI, {
       useNewUrlParser: true,
       useUnifiedTopology: true,
       bufferCommands: false,
       dbName: 'Product',
       autoCreate: false,
       maxPoolSize: 1
    })

    const Product = mongoose.model('Product', item)

    await Product.find({origninator: req.body.originator, last_two_week_statistics: true, secondweek: true})
    
       .then((response)=> {
    
          for ( let i = 0; i < response.length; i++) {

             const getItemDailySalesStatistics = Object.values(response[i].statistics)
             const calculateItemDailyTotalSalesStatistics = getItemDailySalesStatistics.map(data => data * response[i].productprice)

             const ItemDailyTotalSalesStatisticsCalculationResult = {
                digits: calculateItemDailyTotalSalesStatistics
             }

             req.singleCalculationResult.push(ItemDailyTotalSalesStatisticsCalculationResult)    
          }

          const parseItemDailySalesStatistics = req.singleCalculationResult.map((data, idx) => {

            req.getAllSunday.push(data.digits[0])
            req.getAllMonday.push(data.digits[1])
            req.getAllTuesday.push(data.digits[2])
            req.getAllWednesday.push(data.digits[3])
            req.getAllThursday.push(data.digits[4]) 
            req.getAllFriday.push(data.digits[5])   
            req.getAllSaturday.push(data.digits[6])

          })
          
            req.parseAllSunday = req.getAllSunday;
            req.parseAllMonday = req.getAllMonday;
            req.parseAllTuesday = req.getAllTuesday;
            req.parseAllWednesday = req.getAllWednesday;
            req.parseAllThursday = req.getAllThursday;
            req.parseAllFriday = req.getAllFriday;
            req.parseAllSaturday = req.getAllSaturday;

            req.AllSunday = req.parseAllSunday.reduce((previousValues, currentValue) => previousValues + currentValue,
            reduceFunctionBasis
            );
  
            req.AllMonday = req.parseAllMonday.reduce((previousValues, currentValue) => previousValues + currentValue,
            reduceFunctionBasis
            );
  
            req.AllTuesday = req.parseAllTuesday.reduce((previousValues, currentValue) => previousValues + currentValue,
            reduceFunctionBasis
            );
  
            req.AllWednesday = req.parseAllWednesday.reduce((previousValues, currentValue) => previousValues + currentValue,
            reduceFunctionBasis
            );
  
            req.AllThursday = req.parseAllThursday.reduce((previousValues, currentValue) => previousValues + currentValue,
            reduceFunctionBasis
            );
  
            req.AllFriday = req.parseAllFriday.reduce((previousValues, currentValue) => previousValues + currentValue,
            reduceFunctionBasis
            );
  
            req.AllSaturday = req.parseAllSaturday.reduce((previousValues, currentValue) => previousValues + currentValue,
               reduceFunctionBasis
            );
         
            req.sendObj.push(
                             {
                              day: req.AllSunday 
                             },
                             {
                              day: req.AllMonday 
                             },
                             {
                              day: req.AllTuesday 
                             },
                             {
                              day: req.AllWednesday 
                             },
                             {
                              day: req.AllThursday 
                             },
                             {
                              day: req.AllFriday 
                             },
                             {
                              day: req.AllSaturday 
                             },
                            )

                res.send(req.sendObj)

         })
       
    } catch(err) {
        console.log(err.message)
    } finally {

       req.singleCalculationResult = []; 

       req.getAllSunday = [];
       req.parseAllSunday = null;
       req.AllSunday = null;

       req.getAllMonday = [];
       req.parseAllMonday = null;
       req.AllMonday = null;

       req.getAllTuesday = [];
       req.parseAllTuesday = null;
       req.AllTuesday = null;

       req.getAllWednesday = [];
       req.parseAllWednesday = null;
       req.AllWednesday = null;

       req.getAllThursday = [];
       req.parseAllThursday = null;
       req.AllThursday = null;

       req.getAllFriday = [];
       req.parseAllFriday = null;
       req.AllFriday = null;

       req.getAllSaturday = [];
       req.parseAllSaturday = null;
       req.AllSaturday = null;

       req.sendObj = [];

     
    }

})

// get orogonotor first week product statistics 
Router.route('/getorignatorproductstatisticsgraphfirstweek').post( async (req, res)=> {

  const reduceFunctionBasis = 0;
  req.singleCalculationResult = [];
 
  req.getAllSunday = [];
  req.parseAllSunday = null;
  req.AllSunday = null;

  req.getAllMonday = [];
  req.parseAllMonday = null;
  req.AllMonday = null;

  req.getAllTuesday = [];
  req.parseAllTuesday = null;
  req.AllTuesday = null;

  req.getAllWednesday = [];
  req.parseAllWednesday = null;
  req.AllWednesday = null;

  req.getAllThursday = [];
  req.parseAllThursday = null;
  req.AllThursday = null;

  req.getAllFriday = [];
  req.parseAllFriday = null;
  req.AllFriday = null;

  req.getAllSaturday = [];
  req.parseAllSaturday = null;
  req.AllSaturday = null;

  req.sendObj = [];

  try {

    await mongodb.connect(process.env.ATLAS_URI, {
       useNewUrlParser: true,
       useUnifiedTopology: true,
       dbName: 'Product',
       autoCreate: false,
       maxPoolSize: 1
    })

    const Product = mongoose.model('Product', item)

    await Product.find({origninator: req.body.originator, last_two_week_statistics: true, firstweek: true})
    
       .then((response)=> {
    
          for ( let i = 0; i < response.length; i++) {

             const getItemDailySalesStatistics = Object.values(response[i].statistics)
             const calculateItemDailyTotalSalesStatistics = getItemDailySalesStatistics.map(data => data * response[i].productprice)

             const ItemDailyTotalSalesStatisticsCalculationResult = {
                digits: calculateItemDailyTotalSalesStatistics
             }

             req.singleCalculationResult.push(ItemDailyTotalSalesStatisticsCalculationResult)    
          }

          const parseItemDailySalesStatistics = req.singleCalculationResult.map((data, idx) => {

            req.getAllSunday.push(data.digits[0])
            req.getAllMonday.push(data.digits[1])
            req.getAllTuesday.push(data.digits[2])
            req.getAllWednesday.push(data.digits[3])
            req.getAllThursday.push(data.digits[4]) 
            req.getAllFriday.push(data.digits[5])   
            req.getAllSaturday.push(data.digits[6])

          })
          
            req.parseAllSunday = req.getAllSunday;
            req.parseAllMonday = req.getAllMonday;
            req.parseAllTuesday = req.getAllTuesday;
            req.parseAllWednesday = req.getAllWednesday;
            req.parseAllThursday = req.getAllThursday;
            req.parseAllFriday = req.getAllFriday;
            req.parseAllSaturday = req.getAllSaturday;

            req.AllSunday = req.parseAllSunday.reduce((previousValues, currentValue) => previousValues + currentValue,
            reduceFunctionBasis
            );
  
            req.AllMonday = req.parseAllMonday.reduce((previousValues, currentValue) => previousValues + currentValue,
            reduceFunctionBasis
            );
  
            req.AllTuesday = req.parseAllTuesday.reduce((previousValues, currentValue) => previousValues + currentValue,
            reduceFunctionBasis
            );
  
            req.AllWednesday = req.parseAllWednesday.reduce((previousValues, currentValue) => previousValues + currentValue,
            reduceFunctionBasis
            );
  
            req.AllThursday = req.parseAllThursday.reduce((previousValues, currentValue) => previousValues + currentValue,
            reduceFunctionBasis
            );
  
            req.AllFriday = req.parseAllFriday.reduce((previousValues, currentValue) => previousValues + currentValue,
            reduceFunctionBasis
            );
  
            req.AllSaturday = req.parseAllSaturday.reduce((previousValues, currentValue) => previousValues + currentValue,
               reduceFunctionBasis
            );
         
            req.sendObj.push(
                             {
                              day: req.AllSunday 
                             },
                             {
                              day: req.AllMonday 
                             },
                             {
                              day: req.AllTuesday 
                             },
                             {
                              day: req.AllWednesday 
                             },
                             {
                              day: req.AllThursday 
                             },
                             {
                              day: req.AllFriday 
                             },
                             {
                              day: req.AllSaturday 
                             },
                            )
            console.log(req.sendObj)
            res.send(req.sendObj)

         })
       
    } catch(err) {
        console.log(err.message)
    } finally {

       req.singleCalculationResult = []; 

       req.getAllSunday = [];
       req.parseAllSunday = null;
       req.AllSunday = null;

       req.getAllMonday = [];
       req.parseAllMonday = null;
       req.AllMonday = null;

       req.getAllTuesday = [];
       req.parseAllTuesday = null;
       req.AllTuesday = null;

       req.getAllWednesday = [];
       req.parseAllWednesday = null;
       req.AllWednesday = null;

       req.getAllThursday = [];
       req.parseAllThursday = null;
       req.AllThursday = null;

       req.getAllFriday = [];
       req.parseAllFriday = null;
       req.AllFriday = null;

       req.getAllSaturday = [];
       req.parseAllSaturday = null;
       req.AllSaturday = null;

       req.sendObj = [];
     
    }

})

Router.route('/getorignatorproductpresentstatisticsgraphfirstweek').post( async (req, res)=> {
   
  try{

  } catch(err) {
    console.log(err.message)
  } finally {

  }

})

const storage = multer.diskStorage({ 
  destination: function(req, file, cb) {
     cb(null, '../view/public/images/productimages/')
  },                                               
  filename: function(req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({storage: storage})
const uploadFileImages = upload.fields([{name: 'mainproductimages', maxCount: 30},{name: 'selectionproductimages', maxCount: 30}])

async function parseMainSelectionImages(req, res, next) {

    next()

}

async function handleFirstProductAdd(req, res, next) {

  req.previousProductId = undefined;
  req.mainImagesFile = [];
  req.selectionImagesFile = [];

  try {
    
    await mongodb.connect(process.env.ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'Item',
        autoCreate: false,
        maxPoolSize: 1
     })
 
     const Product = mongoose.model('Item', item)

     await Product.find()
        .then( async (response)=> {
          req.previousProductId = response.length;
          if (response.length === 0) { 

            if ( req.files['mainproductimages'] === undefined && req.files['selectionproductimages'] === undefined ) {
         
                let newProduct = new Product({
                                 productId: 1,
                                 productStatisticsId: 1,
                                 last_two_week_statistics: false,
                                 present_statistics: false,
                                 firstweek: false,
                                 secondweek: false,
                                 productname: req.body.productname,
                                 productprice: req.body.productprice,
                                 originator: req.body.productoriginator,
                                 capital: req.body.productcapital,
                                 s_r_p: req.body.s_r_p,
                                 productdescription: req.body.productdescription,
                                 productextrainformationlocation: {
                                    province: req.body.productExtraInformationProvince,
                                    city: req.body.productExtraInformationCity,
                                    baranggay: req.body.productExtraInformationBaranggay,
                                 },
                                 productextrainformationdetails: req.body.productExInformationDetails,
                                 ytlink: req.body.productYTLink,
                                 productmainselectionimages: [req._parsedMainSelectionImages],
                                 productselectionimages: [req._parsedSelectionImages],
                                 productavailablecolors: req.body.productSelectedColors,
                                 productavailablesizes: req.body.productSelectedSizes,
                                 stock: req.body.productInformationStock,
                                 weight: req.body.weight,
                                 shippingoptions: req.body.shippingoptions,
                                 bought: false,
                                 statistics: {
                                   sunday: 0,
                                   monday: 0,
                                   tuesday: 0,
                                   wednesday: 0,
                                   thursday: 0,
                                   friday: 0,
                                   saturday: 0
                                 },
                                isboughtfrom: [],
                                isnowarecord: false,
                                macitem: {
                                  set: req.body.macsetitemnumber,
                                  macitemtype: req.body.macsetproducttype,
                                  ismacitem:  req.body.ismacsetitem,
                                  isaset: req.body.isaset,
                                  setcount: req.body.setcount
                                },
                                isaset: {
                                  isaset: req.body.isaset,
                                  setcount: req.body.setcount
                                },
                                producttype: req.body.producttype,
                                 dateproductpublished: req.body.productpublishedtimestamp
                                 })   
 
                await newProduct.save()
                      .then((response)=> {
                         console.log(response)
                       
                      })

                return

            }
            
            if ( req.files['mainproductimages'] !== undefined && req.files['selectionproductimages'] === undefined ) {
    
              for ( let i = 0; i <  req.files['mainproductimages'].length; i++) {
                req.mainImagesFile.push(`../images/productimages/${req.files['mainproductimages'][i].originalname}`)
              }

              let newProduct = new Product({
                productId: 1,
                productStatisticsId: 1,
                last_two_week_statistics: false,
                present_statistics: false,
                firstweek: false,
                secondweek: false,
                productname: req.body.productname,
                productprice: req.body.productprice,
                originator: req.body.productoriginator,
                capital: req.body.productcapital,
                s_r_p: req.body.s_r_p,
                productdescription: req.body.productdescription,
                productextrainformationlocation: {
                   province: req.body.productExtraInformationProvince,
                   city: req.body.productExtraInformationCity,
                   baranggay: req.body.productExtraInformationBaranggay,
                },
                productextrainformationdetails: req.body.productExInformationDetails,
                ytlink: req.body.productYTLink,
                productmainselectionimages: req.mainImagesFile,
                productselectionimages: [],
                productavailablecolors: req.body.productSelectedColors,
                productavailablesizes: req.body.productSelectedSizes,
                stock: req.body.productInformationStock,
                weight: req.body.weight,
                shippingoptions: req.body.shippingoptions,
                bought: false,
                statistics: {
                  sunday: 0,
                  monday: 0,
                  tuesday: 0,
                  wednesday: 0,
                  thursday: 0,
                  friday: 0,
                  saturday: 0
                },
               isboughtfrom: [],
               isnowarecord: false,
               macitem: {
                set: req.body.macsetitemnumber,
                macitemtype: req.body.macsetproducttype,
                ismacitem:  req.body.ismacsetitem,
                isaset: req.body.isaset,
                setcount: req.body.setcount
              },
              isaset: {
                isaset: req.body.isaset,
                setcount: req.body.setcount
              },
              producttype: req.body.producttype,
               dateproductpublished: req.body.productpublishedtimestamp
                })   

               await newProduct.save()
                   .then((response)=> {
                      console.log(response)
               })

               return
               
            }

            if ( req.files['mainproductimages'] === undefined && req.files['selectionproductimages'] !== undefined ) {
              for ( let i = 0; i <  req.files['selectionproductimages'].length; i++) {
                req.selectionImagesFile.push(`../images/productimages/${req.files['selectionproductimages'][i].originalname}`)
              }
              let newProduct = new Product({
                productId: 1,
                productStatisticsId: 1,
                last_two_week_statistics: false,
                present_statistics: false,
                firstweek: false,
                secondweek: false,
                productname: req.body.productname,
                productprice: req.body.productprice,
                originator: req.body.productoriginator,
                capital: req.body.productcapital,
                s_r_p: req.body.s_r_p,
                productdescription: req.body.productdescription,
                productextrainformationlocation: {
                   province: req.body.productExtraInformationProvince,
                   city: req.body.productExtraInformationCity,
                   baranggay: req.body.productExtraInformationBaranggay,
                },
                productextrainformationdetails: req.body.productExInformationDetails,
                ytlink: req.body.productYTLink,
                productmainselectionimages: [],
                productselectionimages: req.selectionImagesFile,
                productavailablecolors: req.body.productSelectedColors,
                productavailablesizes: req.body.productSelectedSizes,
                stock: req.body.productInformationStock,
                weight: req.body.weight,
                shippingoptions: req.body.shippingoptions,
                bought: false,
                statistics: {
                  sunday: 0,
                  monday: 0,
                  tuesday: 0,
                  wednesday: 0,
                  thursday: 0,
                  friday: 0,
                  saturday: 0
                },
               isboughtfrom: [],
               isnowarecord: false,
               macitem: {
                set: req.body.macsetitemnumber,
                macitemtype: req.body.macsetproducttype,
                ismacitem:  req.body.ismacsetitem,
                isaset: req.body.isaset,
                setcount: req.body.setcount
              },
              isaset: {
                isaset: req.body.isaset,
                setcount: req.body.setcount
              },
              producttype: req.body.producttype,
               dateproductpublished: req.body.productpublishedtimestamp
                })   

               await newProduct.save()
                   .then((response)=> {
                      console.log(response)
               })

               return
            }

            if ( req.files['mainproductimages'] !== undefined && req.files['selectionproductimages'] !== undefined ) {
             
              for ( let i = 0; i <  req.files['mainproductimages'].length; i++) {
                req.mainImagesFile.push(`../images/productimages/${req.files['mainproductimages'][i].originalname}`)
              }
              
              for ( let v = 0; v <  req.files['selectionproductimages'].length; v++) {
                req.selectionImagesFile.push(`../images/productimages/${req.files['selectionproductimages'][v].originalname}`)
              }

              let newProduct = new Product({
                productId: 1,
                productStatisticsId: 1,
                last_two_week_statistics: false,
                present_statistics: false,
                firstweek: false,
                secondweek: false,
                productname: req.body.productname,
                productprice: req.body.productprice,
                originator: req.body.productoriginator,
                capital: req.body.productcapital,
                s_r_p: req.body.s_r_p,
                productdescription: req.body.productdescription,
                productextrainformationlocation: {
                   province: req.body.productExtraInformationProvince,
                   city: req.body.productExtraInformationCity,
                   baranggay: req.body.productExtraInformationBaranggay,
                },
                productextrainformationdetails: req.body.productExInformationDetails,
                ytlink: req.body.productYTLink,
                productmainselectionimages: req.mainImagesFile,
                productselectionimages: req.selectionImagesFile,
                productavailablecolors: req.body.productSelectedColors,
                productavailablesizes: req.body.productSelectedSizes,
                stock: req.body.productInformationStock,
                weight: req.body.weight,
                shippingoptions: req.body.shippingoptions,
                bought: false,
                statistics: {
                  sunday: 0,
                  monday: 0,
                  tuesday: 0,
                  wednesday: 0,
                  thursday: 0,
                  friday: 0,
                  saturday: 0
                },
               isboughtfrom: [],
               isnowarecord: false,
               macitem: {
                set: req.body.macsetitemnumber,
                macitemtype: req.body.macsetproducttype,
                ismacitem:  req.body.ismacsetitem,
                isaset: req.body.isaset,
                setcount: req.body.setcount
              },
              isaset: {
                isaset: req.body.isaset,
                setcount: req.body.setcount
              },
              producttype: req.body.producttype,
               dateproductpublished: req.body.productpublishedtimestamp
              })   
              
              await newProduct.save()
                   .then((response)=> {
                      console.log(response)
               })

              return

            }

          }
          else { 
            next();
          }

        }) 

  }
  catch(err) {
      console.log(err.message)
  }
  finally {
      
  }

}

Router.route('/addproduct').post( uploadFileImages,  handleFirstProductAdd, async (req, res)=> {
 
  console.log(req.body.macsetitemnumber)
  
  await mongodb.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Items',
    autoCreate: false,
    maxPoolSize: 1
 })

const Product = mongoose.model('Item', item)

if ( req.files['mainproductimages'] === undefined && req.files['selectionproductimages'] === undefined ) {
         
    let newProduct = new Product({
                     productId: req.previousProductId + 1,
                     productStatisticsId: req.previousProductId + 1,
                     last_two_week_statistics: false,
                     present_statistics: false,
                     firstweek: false,
                     secondweek: false,
                     productname: req.body.productname,
                     productprice: req.body.productprice,
                     shippingprice: '',
                     originator: req.body.productoriginator,
                     capital: req.body.productcapital,
                     s_r_p: req.body.s_r_p,
                     productdescription: req.body.productdescription,
                     productextrainformationlocation: {
                        island: req.body.productExtraInformationIsland,
                        province: req.body.productExtraInformationProvince,
                        city: req.body.productExtraInformationCity,
                        baranggay: req.body.productExtraInformationBaranggay,
                     },
                     productextrainformationdetails: req.body.productExInformationDetails,
                     ytlink: req.body.productYTLink,
                     productmainselectionimages: [req._parsedMainSelectionImages],
                     productselectionimages: [req._parsedSelectionImages],
                     productavailablecolors: req.body.productSelectedColors,
                     productavailablesizes: req.body.productSelectedSizes,
                     stock: req.body.productInformationStock,
                     weight: req.body.weight,
                     shippingoptions: req.body.shippingoptions,
                     bought: false,
                     statistics: {
                       sunday: 0,
                       monday: 0,
                       tuesday: 0,
                       wednesday: 0,
                       thursday: 0,
                       friday: 0,
                       saturday: 0
                     },
                    isboughtfrom: [],
                    isnowarecord: false,
                    macitem: {
                      set: req.body.macsetitemnumber,
                      macitemtype: req.body.macsetproducttype,
                      ismacitem:  req.body.ismacsetitem,
                      isaset: req.body.isaset,
                      setcount: req.body.setcount
                    },
                    isaset: {
                      isaset: req.body.isaset,
                      setcount: req.body.setcount
                    },
                    productypesort: macsetproducttype,
                    producttype: req.body.producttype,
                    dateproductpublished: req.body.productpublishedtimestamp,
                    itemsoncart: []
                     })   

    await newProduct.save()
          .then((response)=> {
            console.log(response)     
          })

    return

}

if ( req.files['mainproductimages'] !== undefined && req.files['selectionproductimages'] === undefined ) {

  for ( let i = 0; i <  req.files['mainproductimages'].length; i++) {
    req.mainImagesFile.push(`../images/productimages/${req.files['mainproductimages'][i].originalname}`)
  }

  let newProduct = new Product({
    productId: req.previousProductId + 1,
    productStatisticsId: req.previousProductId + 1,
    last_two_week_statistics: false,
    present_statistics: false,
    firstweek: false,
    secondweek: false,
    productname: req.body.productname,
    productprice: req.body.productprice,
    originator: req.body.productoriginator,
    capital: req.body.productcapital,
    s_r_p: req.body.s_r_p,
    vat: req.body.vat,
    productdescription: req.body.productdescription,
    productextrainformationlocation: {
       island: req.body.productExtraInformationIsland,
       province: req.body.productExtraInformationProvince,
       city: req.body.productExtraInformationCity,
       baranggay: req.body.productExtraInformationBaranggay,
    },
    productextrainformationdetails: req.body.productExInformationDetails,
    ytlink: req.body.productYTLink,
    productmainselectionimages: req.mainImagesFile,
    productselectionimages: [],
    productavailablecolors: req.body.productSelectedColors,
    productavailablesizes: req.body.productSelectedSizes,
    stock: req.body.productInformationStock,
    weight: req.body.weight,
    shippingoptions: req.body.shippingoptions,
    bought: false,
    statistics: {
      sunday: 0,
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0
    },
   isboughtfrom: [],
   isnowarecord: false,
   macitem: {
    set: req.body.macsetitemnumber,
    macitemtype: req.body.macsetproducttype,
    ismacitem:  req.body.ismacsetitem,
    isaset: req.body.isaset,
    setcount: req.body.setcount
  },
  isaset: {
    isaset: req.body.isaset,
    setcount: req.body.setcount
  },
  producttype: req.body.producttype,
  dateproductpublished: req.body.productpublishedtimestamp
 })   

   await newProduct.save()
       .then((response)=> {
          console.log(response)
   })

   return
   
}

if ( req.files['mainproductimages'] === undefined && req.files['selectionproductimages'] !== undefined ) {

  for ( let i = 0; i <  req.files['selectionproductimages'].length; i++) {
    req.selectionImagesFile.push(`../images/productimages/${req.files['selectionproductimages'][i].originalname}`)
  }

  let newProduct = new Product({
    productId: req.previousProductId + 1,
    productStatisticsId: req.previousProductId + 1,
    last_two_week_statistics: false,
    present_statistics: false,
    firstweek: false,
    secondweek: false,
    productname: req.body.productname,
    productprice: req.body.productprice,
    originator: req.body.productoriginator,
    capital: req.body.productcapital,
    s_r_p: req.body.s_r_p,
    productdescription: req.body.productdescription,
    productextrainformationlocation: {
       province: req.body.productExtraInformationProvince,
       city: req.body.productExtraInformationCity,
       baranggay: req.body.productExtraInformationBaranggay,
    },
    productextrainformationdetails: req.body.productExInformationDetails,
    ytlink: req.body.productYTLink,
    productmainselectionimages: [],
    productselectionimages: req.selectionImagesFile,
    productavailablecolors: req.body.productSelectedColors,
    productavailablesizes: req.body.productSelectedSizes,
    stock: req.body.productInformationStock,
    weight: req.body.weight,
    shippingoptions: req.body.shippingoptions,
    bought: false,
    statistics: {
      sunday: 0,
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0
    },
   isboughtfrom: [],
   isnowarecord: false,
   macitem: {
    set: req.body.macsetitemnumber,
    macitemtype: req.body.macsetproducttype,
    ismacitem:  req.body.ismacsetitem,
    isaset: req.body.isaset,
    setcount: req.body.setcount
  },
  isaset: {
    isaset: req.body.isaset,
    setcount: req.body.setcount
  },
  producttype: req.body.producttype,
   dateproductpublished: req.body.productpublishedtimestamp
    })   

   await newProduct.save()
       .then((response)=> {
          console.log(response)
   })

   return
}

if ( req.files['mainproductimages'] !== undefined && req.files['selectionproductimages'] !== undefined ) {
 
  for ( let i = 0; i <  req.files['mainproductimages'].length; i++) {
    req.mainImagesFile.push(`../images/productimages/${req.files['mainproductimages'][i].originalname}`)
  }
  
  for ( let v = 0; v <  req.files['selectionproductimages'].length; v++) {
    req.selectionImagesFile.push(`../images/productimages/${req.files['selectionproductimages'][v].originalname}`)
  }

  let newProduct = new Product({
    productId: req.previousProductId + 1,
    productStatisticsId: req.previousProductId + 1,
    last_two_week_statistics: false,
    present_statistics: false,
    firstweek: false,
    secondweek: false,
    productname: req.body.productname,
    productprice: req.body.productprice,
    originator: req.body.productoriginator,
    capital: req.body.productcapital,
    s_r_p: req.body.s_r_p,
    productdescription: req.body.productdescription,
    productextrainformationlocation: {
       province: req.body.productExtraInformationProvince,
       city: req.body.productExtraInformationCity,
       baranggay: req.body.productExtraInformationBaranggay,
    },
    productextrainformationdetails: req.body.productExInformationDetails,
    ytlink: req.body.productYTLink,
    productmainselectionimages: req.mainImagesFile,
    productselectionimages: req.selectionImagesFile,
    productavailablesizes: req.body.productSelectedSizes,
    productavailablecolors: req.selectedColors,
    stock: req.body.productInformationStock,
    weight: req.body.weight,
    shippingoptions: req.body.shippingoptions,
    bought: false,
    statistics: {
      sunday: 0,
      monday: 0,
      tuesday: 0,
      wednesday: 0,
      thursday: 0,
      friday: 0,
      saturday: 0
    },
   macitem: {
      set: req.body.macsetitemnumber,
      macitemtype: req.body.macsetproducttype,
      ismacitem:  req.body.ismacsetitem,
      isaset: req.body.isaset,
      setcount: req.body.setcount
    },
    isaset: {
      isaset: req.body.isaset,
      setcount: req.body.setcount
    },
   producttype: req.body.producttype,
   dateproductpublished: req.body.productpublishedtimestamp,
   isboughtfrom: [],
   isnowarecord: false,
  })   

 await newProduct.save()
    .then((response)=> {
         console.log(response)
 })

  mongoose.connection.close();

}
  
req.previousProductId = undefined;
req.mainImagesFile = [];
req.selectionImagesFile = [];
res.end();

})

Router.route('/getproduct/macsetitemupdate').post( async (req,res)=> {
   
  try {
     
    await mongodb.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'Item',
      autoCreate: false,
      maxPoolSize: 1
   })
  
  const Item = mongoose.model('items', item)

  await Item.findOne({productId: req.body.itemid})
      .then((response)=> {
         console.log('Product id' + req.body.itemid + 'was served!!')
         console.log(response)

         let dataObj = {
            productId: response.productId,
            productName: response.productname,
            productDP: response.productmainselectionimages[0],
            product: response
         }

         res.send(dataObj)

      })

  } catch(err) {
     console.log('Err when getting a product ( MAC set item update)' + err)
     res.send('Code / Err when getting a product ( MAC set item update)')
  } finally {
    mongoose.connection.close()
  }

})

Router.route('/showspecificproduct').post( async (req, res)=> {

  try {
    
    await mongodb.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'Item',
      autoCreate: false,
      maxPoolSize: 5
   })
  
   const Item = mongoose.model('items', item)
   console.log(req.params.productname)
   await Item.find({productname: req.body.productname})
     .then((response)=> {
       console.log(response)
       res.send(response[0])
       mongoose.connection.close();
     })
    

  } catch(err) {
    console.log('Error' + err.message)
  } finally {

  }

})

module.exports = Router;