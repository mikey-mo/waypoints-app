const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId();

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
  email:{
    type: String,
    required: true,
    unique: [true, 'Email must be unique']
  },
  routes: {
    type: Array
  }
})

const User = mongoose.model('user', userSchema);

module.exports = User