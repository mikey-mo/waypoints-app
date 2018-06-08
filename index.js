const express = require('express');
const _ = require('lodash');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const Ninja = require('./models/ninjas.js')
const bcrypt = require('bcrypt');
const passportSetup = require('./config/passport-setup');
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys');

mongoose.connect('mongodb://localhost/ninjago')
mongoose.Promise = global.Promise;

const app = express();

app.use(cookieSession({
  maxAge: 25 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', require('./routes/api'));
app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));

// app.engine('mustache', mustacheExpress());
// app.set('view engine', 'mustache');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req, res) => {
  console.log('GET request');
  res.send({name: 'Yoshi'}); 
});

app.get('/delete/:id', (req, res) => {
  Ninja.findByIdAndRemove({_id: req.params.id}).then((deleted) => {
    res.redirect('../index.html');
  }).catch((e) => {
    console.log(e);
  });
});

app.post('/edit/:id', (req, res) => {
  var body = _.pick(req.body, ['name', 'rank']);
  console.log(body);
  Ninja.findByIdAndUpdate({_id: req.params.id}, body, {new: true}).then((editedNinja) => {
    console.log(editedNinja);
    res.redirect('../index.html');
  }).catch((e) => {
    console.log(e);
  });
});

app.listen(process.env.port || 3000, () => {
  console.log('listening')
});