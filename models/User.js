const mongoose = require('mongoose')
const Run  = require('./Run').schema;

var schema = mongoose.Schema({
  'stravaId' : String,
  'discordId' : String,
  'refreshToken' : String,
  'name' : String,
  'username' : String,
  'profile' : String,
  'totalRuns' : Number,
  'totalDistance' : Number,
  'totalTime' : Number,
  'lastUpdated' : Date,
  'runs' : [
    {
      'id' : String,
      'name' : String,
      'startLatlng' : [Number],
      'endLatlng' : [Number],
      'date' : Date,
      'time' : Number,
      'distance' : Number,
      'summaryPolyline' : String,
    }
  ]
})
module.exports = mongoose.model("User", schema)