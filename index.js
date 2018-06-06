const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/ninjago')
mongoose.Promise = global.Promise;

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  console.log('GET request');
  res.send({name: 'Yoshi'}); 
});

app.post('/', (req, res) => {

});

app.use(bodyParser.json());

app.use('/api', require('./routes/api'));

app.listen(process.env.port || 3000, () => {
  console.log('listening')
});