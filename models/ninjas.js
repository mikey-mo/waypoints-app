const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create geo schema

const geoSchema = new Schema({
  type: {
    type: String,
    default: 'Point',
    required: true
  },
  coords: {
    type: [Number],
    index: '2dsphere'
  }
});

//create ninja schema

const ninjaSchema = new Schema({
  name:{
    type: String,
    required: [true, 'Name Field is Required'],
    unique: true
  },
  rank:{
    type: String,
    required: true
  },
  available:{
    type: Boolean,
    default: true
  },
  geometry: geoSchema
  //add in geolocation
})

const Ninja = mongoose.model('ninja', ninjaSchema);

module.exports = Ninja