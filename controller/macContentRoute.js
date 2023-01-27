const express = require('express');
const Router = require('express').Router();
const mongoose = require('mongoose');

const mongodb = require('../lib/mongodb/database');

const macContents = require('../model/newsModel');
const popularPosts = require('../model/newsModel');
const phNews = require('../model/newsModel');
const videos = require('../model/newsModel');


// multer configuration when adding main news 

const multer = require('multer');

const mainNewsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
       cb(null, '../view/public/images/mainnewsimages/')
    },
    filename: (req, file, cb) => {
       cb(null, file.originalname)
    }
})

const macNewsStorage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, '../view/public/images/macnewsimages/')
   },
   filename: (req, file, cb) => {
      cb(null, file.originalname)
   }
})

const phNewsStorage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, '../view/public/images/phnewsimages/')
   },
   filename: (req, file, cb) => {
      cb(null, file.originalname)
   }
})

const uploadMainNews = multer({storage: mainNewsStorage});
const uploadMacNews = multer({storage: macNewsStorage});
const uploadPhNews = multer({storage: phNewsStorage});


/// adding MAC Content API /// change later
Router.route('/add/macnewsimage').post( uploadMacNews.single('content'), async (req, res) => {
     
   try {

      await mongodb.connect(process.env.ATLAS_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         dbName: 'MacContent',
         autoCreate: false
       })

      const News = mongoose.model('MacContent', macContent);

      const newNews = new News({
           image: '../images/macnewsimages/' + req.file.originalname,
           sequence: req.body.sequence,
           topic: req.body.topic,
           goal: req.body.goal,
           author: req.body.author,
           date: req.body.date,
           ytlinkstatus: false,
           ytlink: ''   
      })
 
    
     
   
     await newNews.save()
           .then((response)=> {
                   console.log(response.topic + ' ' + 'topic' + ' ' + 'added on Mac News...')
           })
   }
   // configure right after creating route
   catch(err) {
      console.log('Error occured while communicating to database' + err)
   } finally {
      await mongoose.connection.close();
   } 
}) 

Router.route('/add/macnewsytlink').post( uploadMacNews.single('content'), async (req, res) => {
     
   try {
 
      await mongodb.connect(process.env.ATLAS_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         dbName: 'MacContent  ',
         autoCreate: false
       })

      const News = mongoose.model('MacContent', macContent);

      const newNews = new News({
           image: '../images/macnewsimages/defaultimage',
           sequence: req.body.sequence,
           topic: req.body.topic,
           goal: req.body.goal,
           author: req.body.author,
           date: req.body.date,
           ytlinkstatus: true,
           ytlink: req.body.ytlink        
      })

      await newNews.save()
           .then((response)=> {
                   console.log(response.topic + ' ' + 'topic' + ' ' + 'added on Mac News...')
                })
   }
   // configure right after creating route
   catch(err) {
      console.log('Error occured while communicating to database' + err)
   } finally {
      await mongoose.connection.close();
   }
  
  
}) 

Router.route('/add/popularpostsimage').post( uploadMainNews.single('content'), async (req, res) => {
   
    try { 

      await mongodb.connect(process.env.ATLAS_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         dbName: 'PopularPosts',
         autoCreate: false
       })

      // do something 

      const News = mongoose.model('PopularPosts', popularPosts);

      const newNews = new News({
         image: '../images/popularpostsimages/' + req.file.originalname,
         sequence: req.body.sequence,
         topic: req.body.topic,
         goal: req.body.goal,
         author: req.body.author,
         date: req.body.date,
         ytlinkstatus: false,
         ytlink: ''   
    })

      // save new news
     // display result as a message
     await newNews.save()
           .then((response)=> {
                   console.log(response.topic + ' ' + 'topic' + ' ' + 'added on Popular posts....')
                })

    } catch(err) { 
        console.log('Error occured while communicating to database' + err)
    } finally {
      await mongoose.connection.close();
      res.status(200).send('Main news added...')
    }

})
Router.route('/add/popularpostslink').post( uploadMacNews.single('content'), async (req, res) => {
     
   try {
 
      await mongodb.connect(process.env.ATLAS_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         dbName: 'PopularPosts',
         autoCreate: false
       })

      const News = mongoose.model('PopularPosts', popularPosts);

      const newNews = new News({
           image: '../images/popularposts/defaultimage',
           sequence: req.body.sequence,
           topic: req.body.topic,
           goal: req.body.goal,
           author: req.body.author,
           date: req.body.date,
           ytlinkstatus: true,
           ytlink: req.body.ytlink        
      })

      await newNews.save()
           .then((response)=> {
                   console.log(response.topic + ' ' + 'topic' + ' ' + 'added on Popular Posts...')
            })
   }
   // configure right after creating route
   catch(err) {
      console.log('Error occured while communicating to database' + err)
   } finally {
      await mongoose.connection.close();
   }
  
  
}) 

Router.route('/ddd').post( async (req, res)=> {
   try { 

      await mongodb.connect(process.env.ATLAS_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         dbName: 'Mainnews',
         autoCreate: false
       })

      // do something 

      const News = mongoose.model('mainnews', macNews);

      const newNews = new News({
           topic: req.body.topic
      })

      console.log(req.file)
      // save new news
     // display result as a message
     await newNews.save()
           .then((response)=> {
                   console.log(response.topic + ' ' + 'topic' + ' ' + 'added on Main News...')
                }).catch((err) => {
                      console.log('Error occured whyl adding a user' + err)
                      res.status(500).send('Error occured whyl adding a user')
                   })

    } catch(err) { 
        console.log('Error occured while communicating to database' + err)
    } finally {
      await mongoose.connection.close();
      res.status(200).send('Main news added...')
    }
})

// MAC content API 
Router.route('/maccontent/maccontent').get( async (req, res) => {

     await mongodb.connect(process.env.ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'MacContent',
        autoCreate: false
      })

      const Maccontent = mongoose.model('maccontents', macContents);

      await Maccontent.find()

      .then((response)=> {
         console.log('MAC content,' + ' ' + response)
          res.status(200).send([{
                topic: "Mac creditcards out soon",
                image: "../images/macnewsimages/mac-creditcard-image.png",
                goal: "Putting prices on Mac credit cards. Website ads, video ads, 14.5% of e…",
                author: "Mac",
                date: "04.28.2022",
                ytlinkstatus: false,
                ytlink: "",
                sequence: "1"
          }, 
         {
         topic: "Macneslt",
         image: "../images/macnewsimages/defaultimage",
         goal: "Mac love nestle, nestle love nestle because nestle love mac, mac love …",
         author: "Mac",
         date: "04.28.2022",
         ytlinkstatus: true,
         ytlink: "https://youtu.be/syZju6ui394",
         sequence: "3"
         }])
          mongoose.connection.close();
      }).catch((err) => {
          console.log('Error occured getting MAC content / MAC content' + err)
      })
   
  

})

Router.route('/popularposts/popularposts').get( async (req, res) => {

     await mongodb.connect(process.env.ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: 'PopularPosts',
        autoCreate: false
      })

      const Maccontent = mongoose.model('PopularPosts', popularPosts);
 
      await Maccontent.find() 
         .then((response)=> {
            mongoose.connection.close();
            res.status(200).send(response)
         })
         .catch((err)=> {
            console.log('Error occured whyl getting main news' + err)
         }) 

})
































///// ????????????????????????
Router.route('whatsuplatestposts/getnews').get( async (req, res)=> {
   
   try {

      await mongodb.connect(process.env.ATLAS_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         bufferCommands: false,
         dbName: 'Mainnews',
         autoCreate: false
       })
 
       const News = mongoose.model('mainnews', mainNews);
 
     
      // do something 
      await News.find() 
            .then((response)=> {
                    console.log(response)
                    
                    res.status(200).send(response)
                 }).catch((err) => {
                       console.log('Error occured whyl adding a user' + err)
                    })
    } catch(err) {
      console.log('Error occured whyl getting main news' + err)
    } finally {
      mongoose.connection.close();
    }
 
})

Router.route('/whatupmainnews/getnews1').get( async (req, res) => {
   try {

      await mongodb.connect(process.env.ATLAS_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         bufferCommands: false,
         dbName: 'Mainnews',
         autoCreate: false
       })


      // do something 
   
      const MainNews = mongoose.model('mainnews', mainNews)

      await MainNews.find({sequence: 1}, (err, docs) => {
          if (err) {
             console.log('Error occured whyl getting main news topic sequence number 1')
          } else {
             console.log(docs)
            
             res.status(200).send(docs)
          }
      })
   } catch(err) {
       console.log('Error occured whyl getting main news' + err)
   } finally {
      mongoose.connection.close();
   }
})

Router.route('/whatupmainnews/whatsupallrestofthemainnews').get( async (req, res)=> {
   try {
    
      await mongodb.connect(process.env.ATLAS_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         bufferCommands: false,
         dbName: 'Mainnews',
         autoCreate: false
       })

       // do something
       const MainNews = mongoose.model('mainnews', mainNews)

       await MainNews.find({sequence: {$ne: 1}}, (err, docs) => {
         if (err) {
            console.log('Error occured whyl getting main news topic sequence number 1')
         } else {
            console.log(docs)
         
            res.status(200).send(docs)
         }
       })

   } catch(err) {
     console.log('Error occured whyl getting what are the rest of the main news' + err)
   } finally {
      mongoose.connection.close();
   }
})

// mac news route
Router.route('/whatupmacnews/getmacnews1').get( async (req, res)=> {
  try {
  
   await mongodb.connect(process.env.ATLAS_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      dbName: 'Macnews',
      autoCreate: false
   })

   // do something 
   
   const MacNews = mongoose.model('macnews', macNews)

   await MacNews.find({sequence: 1}, (err, docs) => {
         if (err) {
            console.log('Error occured whyl getting mac news topic sequence number 1')
         } else {
            console.log(docs)
            res.status(200).send(docs)
         }
  })
  } catch(err) {
     console.log('Error occured whyl getting main news' + err)
  } finally {
    mongoose.connection.close();
  }
})

Router.route('/whatupmainnews/whatsupallrestofthemacnews').get( async (req, res)=> {
   try {
    
      await mongodb.connect(process.env.ATLAS_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         bufferCommands: false,
         dbName: 'Macnews',
         autoCreate: false
       })

       // do something
       const MainNews = mongoose.model('macnews', mainNews)

       await MainNews.find({sequence: {$ne: 1}}, (err, docs) => {
         if (err) {
            console.log('Error occured whyl getting main news topic sequence number 1')
         } else {
            console.log(docs)
            res.status(200).send(docs)
         }
     })

   } catch(err) {
     console.log('Error occured whyl getting what are the rest of the main news' + err)
   } finally {
      mongoose.connection.close();
   }
})

// ph news 
Router.route('/add/phnews').post( uploadPhNews.single('content'),async (req, res) => {
   try {
       
      await mongodb.connect(process.env.ATLAS_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         bufferCommands: false,
         dbName: 'Phnews',
         autoCreate: false
       })

      const News = mongoose.model('Phnews', phNews);

      const newNews = new News({
           topic: req.body.topic,
           image: '../images/phnewsimages/' + req.file.originalname,
           goal: req.body.goal,
           author: req.body.author,
           date: req.body.date,
           sequence: req.body.sequence
      })

     // save new user 
     // display result as a message
     await newNews.save()
           .then((response)=> {
                   console.log(response.topic + ' ' + 'topic' + ' ' + 'added on Mac News...')
                }).catch((err) => {
                      console.log('Error occured whyl adding a user' + err)
                      res.status(500).send('Error occured whyl adding a user')
                   })

   } catch(err) {
      console.log('Error occured while communicating to database' + err)
   } finally {
      await mongoose.connection.close();
      
   }
})

Router.route('/whatsupphnews/allofthephnews').get( async (req, res) => {

   try {

     await mongodb.connect(process.env.ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false,
        dbName: 'Phnews',
        autoCreate: false
      })

      const News = mongoose.model('phnews', phNews);

     // do something 
     await News.find()
           .then((response)=> {
                   console.log(response)
                   res.status(200).send(response)
                }).catch((err) => {
                      console.log('Error occured whyl adding a user' + err)
                   })
   } catch(err) {
     console.log('Error occured whyl getting main news' + err)
   } finally {
     mongoose.connection.close();
   }

})

// videos
Router.route('/add/videos').post( async (req, res) => {
   try {
      await mongodb.connect(process.env.ATLAS_URI, {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         bufferCommands: false,
         dbName: 'Videos',
         autoCreate: false
       })

       const Videos = mongoose.model('Videos', videos);

       const newVideo = new Videos({
         topic: req.body.topic,
         goal: req.body.goal,
         author: req.body.author,
         date: req.body.date,
         sequence: req.body.sequence,
         ytvideo: req.body.video
    })

      // save new user 
      // display result as a message
      await newVideo.save()
         .then((response)=> {
                 console.log(response.topic + ' ' + 'topic' + ' ' + 'added on Videos...')
              }).catch((err) => {
                    console.log('Error occured whyl adding a user' + err)
                    res.status(500).send('Error occured whyl adding a user')
              })


   } catch(err) {
       console.log('Error occured whyl getting main news' + err)
   } finally {
       mongoose.connection.close();
   }
})

Router.route('/whatsupphnews/allvideos').get( async (req, res) => {

   try {

     await mongodb.connect(process.env.ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false,
        dbName: 'Videos',
        autoCreate: false
      })

      const Videos = mongoose.model('videos', videos);

     // do something 
     await Videos.find()
           .then((response)=> {
                   console.log(response)
                   res.status(200).send(response)
                }).catch((err) => {
                      console.log('Error occured whyl adding a user' + err)
                   })
   } catch(err) {
     console.log('Error occured whyl getting main news' + err)
   } finally {
     mongoose.connection.close();
   }

})


module.exports = Router;