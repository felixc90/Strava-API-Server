const mongoose = require('mongoose')

var schema = mongoose.Schema({
  'id' : String,
  'name' : String,
  'startLatlng' : [Number],
  'endLatlng' : [Number],
  'date' : Date,
  'time' : Number,
  'distance' : Number,
  'summaryPolyline' : String,
})

module.exports = mongoose.model("Run", schema)