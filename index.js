const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const passportSetup = require('./config/passport-setup');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');
const dateFormat = require('dateformat');
const mongoConnect = encodeURIComponent(process.env.MONGOLAB_URI);

mongoose.connect(mongoConnect)
mongoose.Promise = global.Promise;

const app = express();

app.use(cookieSession({
  maxAge: 25 * 60 * 60 * 1000,
  keys: [process.env.COOKIE_KEY]
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/waypoints', require('./routes/waypoints'));

const authCheck = (req, res, next) => {
  if(!req.user){
    res.redirect('/auth/login');
  } else {
    next();
  }
};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/create', authCheck, (req, res) => {
  res.render('index', {user: req.user })
});

app.get('/', (req, res) => {
  if(req.user) {
    res.redirect('profile');
  } else {
  res.render('login', { user: req.user, dateFormat });
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('listening')
});