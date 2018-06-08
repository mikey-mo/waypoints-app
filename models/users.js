const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create ninja schema

const userSchema = new Schema({
  username:{
    type: String,
    required: [true, 'Name Field is Required']
  },
  googleid:{
    type: String,
    required: true
  },
  available:{
    type: Boolean,
    default: true
  },
  email:{
    type: String,
    required: true,
    unique: [true, 'email must be unique']
  }
})

const User = mongoose.model('user', userSchema);

module.exports = User