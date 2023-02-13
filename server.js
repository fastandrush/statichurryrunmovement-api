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

const loginRoute = require('./controller/loginRoute.js');
const marketingRoute = require('./controller/marketingRoute.js');

const contentRoute = require('./controller/contentRoute.js');

const userRoute = require('./controller/userRoute.js');
const addressRoute = require('./controller/addressRoute.js');
const productRoute = require('./controller/productRoute.js');
const macministratorRoute = require('./controller/macministratorRoute.js');


const itemsRoute = require('./controller/itemRoute.js');
const shippingRoute = require('./controller/shippingRoute.js');
const shareRoute = require('./controller/shareRoute.js');
const storedItemRevenueRoute = require('./controller/storedItemRevenueRoute.js');
const fundsRoute = require('./controller/fundsRoute.js');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors({
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  preflightContinue: false,
  optionsSuccessStatus: 200
}));


const sessionInilizationConfiguration = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'Sessions',
  autoCreate: false
}

const sessionStore = MongoStore.create({
  mongoUrl: 'mongodb+srv://Mac:ukNaxwDH30S6aaoz@cluster0.q2m1o.mongodb.net/?retryWrites=true&w=majority', sessionInilizationConfiguration,
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


app.use('/authenticate', loginRoute);
app.use('/mpcholder', userRoute);

app.use('/marketing', marketingRoute);
app.use('/getitems', productRoute);

app.use('/content', contentRoute);

///
app.use('/shipping', shippingRoute);

app.use('/population', addressRoute);
app.use('/macministrator', macministratorRoute);

app.use('/item', itemsRoute);
app.use('/share', shareRoute);
app.use('/storeditemrevenue', storedItemRevenueRoute);
app.use('/funds', fundsRoute);


//app.use(express.static(__dirname, 'view/build'))

app.use(express.static('view/build'));

mongoose.connect(process.env.ATLAS_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  autoCreate: false,
  bufferCommands: false
})

mongodb.log(mongoose.connection);

if ( process.env.NODE_ENV === 'production' ) {
  app.get('/', (req,res) => {
     res.sendFile(path.join(__dirname, 'view/build', 'index.html'));
  })

}  

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));