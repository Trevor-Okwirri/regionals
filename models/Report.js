const mongoose = require('mongoose');

const crimeReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Robbery', 'Assault','Abuse', 'Burglary', 'Drug Offense', 'Fraud', 'Murder','Other'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  video: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }]
},
{ timestamps: true });

const CrimeReport = mongoose.model('CrimeReport', crimeReportSchema);

module.exports = CrimeReport;
