
const mongodb = require('../../lib/mongodb/database');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const user = require('../../model/userModel');
const { UserBindingPage } = require('twilio/lib/rest/chat/v2/service/user/userBinding');

const customFields = {
    usernameField: 'fn',
    lastnameField: 'ln'
}

async function verifyCallback(fn, ln, done) {

    try {

    await mongodb.connect(process.env.ATLAS_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false,
        dbName: 'Macuser',
        autoCreate: false
     })
  
     const User = mongoose.model('macusers', user)

     await User.findOne({firstname: fn})

     .then((user)=> {

        if(!user) { return done(null, false)}

        if (user) { return done(null, user)}

     })
    
    } catch(e) {
      return done(e)
    } finally {
        mongoose.connection.close();
    }

}

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);


passport.serializeUser((user, done) => {  
   return done(null, user.firstname)
})

//// ????
passport.deserializeUser((user, done) => {
   return done(null, user)
})

 



