const mongoose = require('mongoose');

const factSchema = new mongoose.Schema({
  fact: { type: String, required: true , unique: true},
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},{ timestamps: true });

module.exports = mongoose.model('Fact', factSchema);
