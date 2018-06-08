const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Ninja = mongoose.model('ninja', ninjaSchema);

module.exports = Ninja