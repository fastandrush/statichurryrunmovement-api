require('dotenv').config();

const express = require('express');
const session = require('express-session');
const passport = require('passport');

const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const mongodb = require('./lib/mongodb/database');

//mongoose.set('bufferCommands', false);

const cors = require('cors');

const path = require('path');

const Xendit = require('xendit-node');

const app = express();
const PORT = process.env.PORT || 4000 ;

const macContentRoute = require('./controller/macContentRoute.js');
const userRoute = require('./controller/userRoute.js');
const addressRoute = require('./controller/addressRoute.js');
const productRoute = require('./controller/productRoute.js');
const macministratorRoute = require('./controller/macministratorRoute.js');
const loginRoute = require('./controller/loginRoute.js');
const macSetItemRoute = require('./controller/macSetItemRoute.js');
const itemsRoute = require('./controller/itemRoute.js');
const shippingRoute = require('./controller/shippingRoute.js');
const shareRoute = require('./controller/shareRoute.js');
const storedItemRevenueRoute = require('./controller/storedItemRevenueRoute.js');
const fundsRoute = require('./controller/fundsRoute.js');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
}));


const sessionInilizationConfiguration = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'Sessions',
  autoCreate: false
}

const sessionStore = MongoStore.create({
  mongoUrl: 'mongodb+srv://Mac:ukNaxwDH30S6aaoz@cluster0.q2m1o.mongodb.net/Mainnews?retryWrites=true&w=majority', sessionInilizationConfiguration,
  collection: 'sessions',
  dbName: 'Sessions'
})


app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  autoRemove: 'native',   
  store: sessionStore, 
  cookie: {
     maxAge: 1000 * 60 * 60 * 24
  }
}))

app.use('/maccontent', macContentRoute);
app.use('/macsetitem', macSetItemRoute);
app.use('/shipping', shippingRoute);
app.use('/getitems', productRoute);
app.use('/futuremacholder', userRoute);
app.use('/population', addressRoute);
app.use('/macministrator', macministratorRoute);
app.use('/authentication', loginRoute);
app.use('/item', itemsRoute);
app.use('/share', shareRoute);
app.use('/storeditemrevenue', storedItemRevenueRoute);
app.use('/funds', fundsRoute);


app.get('/', (req, res)=> {
  console.log(req.sessionID)
  res.send(req.sessionID)
})

mongodb.log(mongoose.connection);

if ( process.env.NODE.ENV === 'production' ) {
  app.use(express.static('view/build'))

  app.get('*', (req,res) => {
     res.sendFile(path.join(_dirname, 'view', 'build', 'index.html'));
  })

} 

console.log(process.env.ATLAS_URI)
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));