const express = require("express");
const app = express();
const mongoose = require('mongoose');
app.disable('x-powered-by')
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
require('dotenv').config();
const bodyParser = require('body-parser');
// DOTENV ::::::::::::::::::::::
const MONGO_ACCESS = process.env.MONGOLAB_URI;


mongoose.connect(MONGO_ACCESS,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));


// ROUTES ::::::
const saucesRoutes = require('./routes/sauces');
const userRoutes = require('./routes/user');
  

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use('/api/sauces', saucesRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app;
