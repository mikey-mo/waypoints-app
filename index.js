const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const Ninja = require('./models/ninjas.js')

mongoose.connect('mongodb://localhost/ninjago')
mongoose.Promise = global.Promise;

const app = express();

app.use(methodOverride('X-HTTP-Method-Override'));


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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', require('./routes/api'));

app.listen(process.env.port || 3000, () => {
  console.log('listening')
});