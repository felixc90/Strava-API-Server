const mongoose = require('mongoose')

var schema = mongoose.Schema({
  'stravaId' : String,
  'discordId' : String,
  'refreshToken' : String,
  'name' : String,
  'sex' : String,
  'region' : String,
  'joinedAt' : Date,
  'username' : String,
  'profile' : String,
  'totalRuns' : Number,
  'totalDistance' : Number,
  'totalTime' : Number,
  'longestRun' : {
    'id' : String,
    'name' : String,
    'startLatlng' : [Number],
    'endLatlng' : [Number],
    'date' : Date,
    'time' : Number,
    'distance' : Number,
    'summaryPolyline' : String,
  },
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