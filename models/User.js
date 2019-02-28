const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  user: { type: String, required: true, unique: true },
  email: String,
  password: String

});

userSchema.set('timestamps', true);

const User = mongoose.model('User', userSchema);

module.exports = User;
