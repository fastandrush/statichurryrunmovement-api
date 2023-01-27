const express = require('express');
const Router = require('express').Router();

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mongodb = require('../lib/mongodb/database');

const investor = require('../model/userModel');

const { scope, membership } = require('../model/scopeModel');
/// address different instead nested within investor data for parsing addresses and displaying it
// to UI explictly
const address = require('../model/addressModel');


async function getMac(req, res, next) {
  
  req.globalId = 0;
  req.globalParsedScope = undefined;
  req.stop = false

  await mongodb.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      dbName: 'Investor',
      autoCreate: false
  })
 
  const Investor = mongoose.model('investors', investor)
  
  const investors = await Investor.find()
  const newInvestor = await Investor.find({firstname: req.body.firstname, middlename: req.body.middlename, lastname: req.body.lastname})
  const getInvestorlength = await Investor.find({ id: { $ne: undefined } })
  const specifyInvestorId = getInvestorlength.length
  req.globalId = specifyInvestorId

  const _monthTimeStamp = new Date()
  const monthsArray = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const month = monthsArray[_monthTimeStamp.getMonth()]

  const base = 8
  const scope = investors.length % base
  const parseScope = base + newInvestor.length
  req.globalParsedScope = scope
  console.log(scope)
  /// main conditions, < 7 length || > 7 length
  /// rant control at 7
  if ( investors.length < 8 ) {

   /// two conditions apply, if investor just got invested and if investor invested before ( already got re-
   // cords on db )
   /// condition one, no records of an investor in db
   /// this condition ( condition one ) will nest condition of a parsed scope of 8
   /// if the investor not on db yet
   if ( newInvestor.length === 0 ) {

       /// parsed scope of zero means if it meet's a specified scope
       /// this scope trigger investor data based === true hammer === false rant and what stock it invested e.g goods ( food ), items ( all not including food )
       /// based 7

         if (  scope === 0 ) {
   
            const saveInvestor = new Investor({
                  authenticated: false,
                  id: specifyInvestorId,
                  firstname: req.body.firstname,
                  middlename: req.body.middlename,
                  lastname: req.body.lastname,
                    address: {
                      mc: {
                        fn: req.body.firstname,
                        middlename: req.body.middlename,
                        ln: req.body.lastname, 
                      },
                    isl: req.body.island,
                    pr: req.body.province,
                    cty: req.body.city,
                    brgy: req.body.baranggay,
                    st: req.body.street,
                    tm: req.body.street
                    },
                  contactnumber: req.body.contactnumber,
                  contactemail: req.body.contactemail,
                  scope: [],
                  based: true,
                  hammer: false,
                  maccredits: {
                    based: 0,
                    investment: 0
                  },
                  invesment: {
                    invested: true,
                    investment: {
                      goods: true,
                      items: false,
                    },
                  lastinvested: {
                    date: month,
                    lastmonth: false
                  }
                 },
                 itemsoncart: [],
                 undertaker: []
            })
    
            await saveInvestor.save()
             .then((response)=> {
                 console.log(response)
                 mongoose.connection.close()
                 console.log('Based investor stock holder save') 
                 req.stop = true
                 next()       
             })
             .catch((err)=> {
                console.log('Error saving investor' + err)
             })
    
         }

       // parsed scope greater than zero means it doesnt meet the specified parsed scope 
       /// this scope trigger investor data based === false hammer === true rant and what stock it invested e.g goods ( food ), items ( all not including food )
         if (  scope !== 0 ) {
    
          const saveInvestor = new Investor({
             authenticated: false,
             id: specifyInvestorId,
             firstname: req.body.firstname,
             middlename: req.body.middlename,
             lastname: req.body.lastname,
               address: {
                 mc: {
                   fn: req.body.firstname,
                   middlename: req.body.middlename,
                   ln: req.body.lastname, 
                 },
               isl: req.body.island,
               pr: req.body.province,
               cty: req.body.city,
               brgy: req.body.baranggay,
               st: req.body.street,
               tm: req.body.street
               },
             contactnumber: req.body.contactnumber,
             contactemail: req.body.contactemail,
             scope: [],
             based: false,
             hammer: true,
             maccredits: {
               based: 0,
               investment: 0
             },
             invesment: {
               invested: true,
               investment: {
                 goods: true,
                 items: false,
               },
             lastinvested: {
               date: month,
               lastmonth: false
             }
            },
            itemsoncart: [],
            undertaker: []
          })
    
          await saveInvestor.save()
           .then((response)=> {
              console.log(response)
              console.log('Hammer investor stock holder save')
              mongoose.connection.close()
              next()       
            })
           .catch((err)=> {
             console.log('Error saving investor' + err)
           })
         }
   
   }

   // condition two, already invested before, records in db
   // amid month function will run to set all investor id to undefined on reset capabilities
   if ( newInvestor.length !== 0 ) {
       // base 8
       if ( parseScope === 0 ) {
          /// id was used to reset rant scope 
          if ( newInvestor[0].id !== undefined  ) {
             return
          }
   
          if ( newInvestor[0].id === undefined) {
             return
          }
       }
   
       if ( parseScope !== 0 ) {
         
         if ( newInvestor[0].id !== undefined  ) {
            return
         }
   
         if ( newInvestor[0].id === undefined) {
   
            const saveInvestor = new Investor({
                     authenticated: false,
                     id: specifyInvestorId,
                     firstname: req.body.firstname,
                     middlename: req.body.middlename,
                     lastname: req.body.lastname,
                     address: {
                         mc: {
                         fn: req.body.firstname,
                         middlename: req.body.middlename,
                         ln: req.body.lastname, 
                     },
                     isl: req.body.island,
                     pr: req.body.province,
                     cty: req.body.city,
                     brgy: req.body.baranggay,
                     st: req.body.street,
                     tm: req.body.street
                     },
                    contactnumber: req.body.contactnumber,
                    contactemail: req.body.contactemail,
                    scope: [],
                    based: true,
                    hammer: false,
                    maccredits: {
                      based: 0,
                      investment: 0
                    },
                    invesment: {
                      invested: true,
                      investment: {
                        goods: true,
                        items: false,
                     },
                    lastinvested: {
                       date: month,
                       lastmonth: false
                    }
                   },
                   itemsoncart: [],
                   undertaker: []
                  })
   
   await saveInvestor.save()
    .then((response)=> {
        console.log(response)
        console.log('Investor save') 
        mongoose.connection.close()
        next()       
    })
    .catch((err)=> {
       console.log('Error saving investor' + err)
   })
         }
   
       }
   
       
   
         console.log(newInvestor[0].id)
         mongoose.connection.close()
         res.end()
   
     //      const compromiseInvestor = await Investor.findOneAndUpdate({firstname: req.body.firstname, middlename: req.body.middlename, lastname: req.body.lastname},
     //          {id: specifyInvestorId}, function(err, investor){
    //              if (err) {return console.log(err, investor)}
     //             
     //               console.log(investor)
     //               console.log('Welcome back, thank you for patronage..')
     //               mongoose.connection.close()
     //               res.end()
               
     //          })
   
   }

  }

  /// stock holder length greater than zero, same condition implies, using parsed scope base seven to
  //  deter if based === true && hammer === false || based === false && hammer === true but here
  // need to pass data to determine where to rant scope because based got a control of base 7 
 /// based specified scope reached
  if ( investors.length > 7 ) {
  
    /// no records of investor's in db yet
    if ( newInvestor.length === 0 ) {
    
     // base 8
      if ( parseScope === 0 ) {
     
         const saveInvestor = new Investor({
            authenticated: false,
            id: specifyInvestorId,
            firstname: req.body.firstname,
            middlename: req.body.middlename,
            lastname: req.body.lastname,
            address: {
                mc: {
                fn: req.body.firstname,
                middlename: req.body.middlename,
                ln: req.body.lastname, 
            },
            isl: req.body.island,
            pr: req.body.province,
            cty: req.body.city,
            brgy: req.body.baranggay,
            st: req.body.street,
            tm: req.body.street
            },
           contactnumber: req.body.contactnumber,
           contactemail: req.body.contactemail,
           scope: [],
           based: false,
           hammer: true,
           maccredits: {
             based: 0,
             investment: 0
           },
           invesment: {
             invested: true,
             investment: {
               goods: true,
               items: false,
            },
           lastinvested: {
              date: month,
              lastmonth: false
           }
          },
          itemsoncart: [],
          undertaker: []
         })

   await saveInvestor.save()
     .then((response)=> {
        console.log(response)
        mongoose.connection.close()
        console.log('Based investor stock holder save') 
        next()       
     })
     .catch((err)=> {
        console.log('Error saving investor' + err)
   })

      }
  
      if ( parseScope !== 0 ) {
          
           const saveInvestor = new Investor({
                    authenticated: false,
                    id: specifyInvestorId,
                    firstname: req.body.firstname,
                    middlename: req.body.middlename,
                    lastname: req.body.lastname,
                    address: {
                        mc: {
                        fn: req.body.firstname,
                        middlename: req.body.middlename,
                        ln: req.body.lastname, 
                    },
                    isl: req.body.island,
                    pr: req.body.province,
                    cty: req.body.city,
                    brgy: req.body.baranggay,
                    st: req.body.street,
                    tm: req.body.street
                    },
                   contactnumber: req.body.contactnumber,
                   contactemail: req.body.contactemail,
                   scope: [],
                   based: false,
                   hammer: true,
                   maccredits: {
                     based: 0,
                     investment: 0
                   },
                   invesment: {
                     invested: true,
                     investment: {
                       goods: true,
                       items: false,
                    },
                   lastinvested: {
                      date: month,
                      lastmonth: false
                   }
                  },
                  itemsoncart: [],
                  undertaker: []
                 })
  
           await saveInvestor.save()
             .then((response)=> {
                console.log(response)
                console.log('Hammber investor stock holder save') 
                mongoose.connection.close()
                next()       
             })
             .catch((err)=> {
                console.log('Error saving investor' + err)
           })
      }
  
    }

    // function that will on reset
    // skipped first
    if ( newInvestor.length !== 0 ) {

    }
     
  
  }

}

async function createScope(req, res, next) {
   
  req.rantScope = undefined;

  await mongodb.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'Investor',
      autoCreate: false
  })
 
  const Scope = await mongoose.model('scopes', scope)

  const fullRantScope = await Scope.find()
  /// fullRantScopeLength is current number of scopes belong to an investor in db, this data will be
  // triggered / change by incrementing current length plus 1 when the scope length reach a scope of 
  // seven that means it meets the base 7 specified scope why incrementing the this data length plus one 
  // to be used as scope id creating next scope
  const fullRantScopeLength = fullRantScope.length
  req.rantScope = fullRantScopeLength;
   
  /// fullRantScopeLength equal to zero no scope created yet
   if ( fullRantScopeLength === 0 ) {
     
      const scope = new Scope({
                               scopeid: req.globalId,
                               scope: [membership] 
                              })

      await scope.save()
         .then((response)=> {
            console.log(response)
            console.log('First rant scope created')
            mongoose.connection.close()
            next();
         })
         .catch((err)=> {
            console.log('Error creating scope' + err)
         })

   }


  /// fullRantScopeLength greater than zero updating active scope ###push investor to scope collection in db
  /// and hammer a based
   if ( fullRantScopeLength !== 0 ) {

      /// globalParsedScope base seven rant, determing when to create scope and hammer a based
      /// first condition base seven rant === false

      if ( req.globalParsedScope !== 0 ) {

        Scope.findOneAndUpdate({scopeid: fullRantScopeLength - 1},
            {$push: {scope: {
                       investorscopeid: req.globalId,
                       firstname: req.body.firstname,
                       middlename: req.body.middlename,
                       lastname: req.body.lastname
                    }}}, function(err, investor) {
                       if (err) {return console.log(`Error on inserting investor on scope ${req.globalId}` + err)}
                       console.log(investor)
                       mongoose.connection.close()
                       console.log('Hammer investor inserting on rant scope inserted')
                       next()
          })

      }
      /// first condition base seven rant === true
      if ( req.globalParsedScope === 0 ) {

          Scope.findOneAndUpdate({scopeid: fullRantScopeLength - 1},
                                      {$push: {scope: {
                                           macuserscopeid: req.globalId,
                                           firstname: req.body.firstname,
                                           middlename: req.body.middlename,
                                           lastname: req.body.lastname
                                      }}}, async function(err, investor) {

                                         if (err) {console.log('Error ranting last scope' + err)}
                                        
                                         const scope = new Scope({
                                          scopeid: fullRantScopeLength,
                                          scope: [membership] 
                                         })
                              
                                         await scope.save()
                                           .then((response)=> {
                                               console.log(response)
                                               console.log('Creating next scope created, hammer investor inserting on scope inserted')
                                               mongoose.connection.close()
                                               next();
                                           })
                                          .catch((err)=> {
                                              console.log('Error creating rant scope' + err)
                                          })
                                     })

    
      }
     
   }

}

async function appendScope(req, res, next) {


   if ( req.stop === true ) {
     next()
   } else {

   await mongodb.connect(process.env.ATLAS_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         dbName: 'Investor',
         autoCreate: false
     })
    
     const Investor = mongoose.model('investors', investor)

     Investor.findOneAndUpdate({id: req.rantScope - 1},
                               {$push: {scope: {
                                       id: req.globalId,
                                       firstname: req.body.firstname,
                                       middlename: req.body.middlename,
                                       lastname: req.body.lastname
                                     }}, based: true, hammer: false}, async function(err, investor) {
                                       if (err) {console.log('Err on inserting scope')}
                                       console.log(investor)
                                       console.log('Base investor hammered')
                                       mongoose.connection.close()
                                       next()
                                     })
   }                          

}

/////
Router.route('/invest').post( getMac, createScope, appendScope, async (req, res) => {
  req.stop = false;
  console.log('Have a good day')
  res.status(200).send('Good investment')
})
///////
Router.route('/validatingpersonalinformation').post( async (req, res)=> {

   await mongodb.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'Macuser',
      autoCreate: false
   })

   const User = mongoose.model('Macuser', investor)
   
   await User.find({lastname: req.body.lastname})
       .then((response)=> {

            if (response.length === 0) {
               console.log('Personal info doesnt have duplicate')
               res.status(200).send('200')
            } else {
   
               if (response.firstname === req.body.firstname) {
                   if (response.middlename === req.body.middlename) {
                      console.log('Duplicate user')
                      res.status(200).send('11')
                   } else {
                     console.log('Duplicate last name and first name but different middle name, physical validate user')
                      res.status(200).send('10')
                   }
               } else {
                  console.log('Personal info doesnt have duplicate')
                      res.status(200).send('200')
               }

            }

   })

})
/////
Router.route('/validatingcontactnumberinformation').get( async (req, res)=> {
 
   const accountSid = 'AC7ac25e0299a2a8e8bd1f4d6c66f2179a';
   const authToken = '7cbccf0329f78f89334f27ff924e1737';
 

   const characters ='1234567890';


   function generateString(length) {
      let result = ' ';
      const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    } 
  
   const generatedPasscode = generateString(6);

    const client = require('twilio')(accountSid, authToken)
    
    client.messages
           .create({body: generatedPasscode, from: '+16515054448', to: '+639550744118'})
           .then(message => console.log(message.sid));
     
   
    res.status(200).send(generatedPasscode);
    
})
/////
Router.route('/validatephonenumber').post(async (req, res)=> {
   
   await mongodb.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'Macuser',
      autoCreate: false
   })

   const User = mongoose.model('Macuser', investor)
  
   User.find({contactnumber: req.body.contactnumber})
      .then((response)=> {
           console.log(response.data)
           if ( response.length === 0 ) {
           //    return res.status(200).send('No duplicate contact number')
           } 
           if ( response.length !== 0 ) {
            return res.status(200).send('211')
           }
           if ( response.data === undefined ) {
            return res.status(200).send('No duplicate contact number')
           }
      })

      return res.status(200).send('No duplicate contact number')
   
})
/////
Router.route('/getcurrentlyloginmacuser').post(async (req, res)=> {
    
    //  await mongodb.connect(process.env.ATLAS_URI, {
     //    useNewUrlParser: true,
     //    useUnifiedTopology: true,
     //    bufferCommands: false,
     //    dbName: 'Investor',
     //    autoCreate: false
     // })
  
     console.log('mac')
      await mongoose.connect(process.env.ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'Investor',
        autoCreate: false
      })
   
      const User = mongoose.model('investors', investor)
     
      await User.find({firstname: req.body.user})
        .then((response)=> {
          console.log(response)
          const maccredits = Number(response[0].maccredits.based) + Number(response[0].maccredits.investment)
       
          const _currentLoginUserData = {
             firstname: response[0].firstname,
             userlocation: response[0].address.isl,
             maccredits:  response[0].maccredits,
             itemsoncart: response[0].itemsoncart
          }
 
          console.log(_currentLoginUserData)
          mongoose.connection.close();
          res.send(_currentLoginUserData)
      })
     .catch((err)=> {
         console.log('Code first' + err)
         res.send('Code first')
     })

})

module.exports = Router;