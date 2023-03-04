const mongoose = require('mongoose')

var schema = mongoose.Schema({
  'name' : String,
  'guildId' : String,
  'members' : [{
    'id' : String,
    'joinedAt' : Date,
    'totalExp' : Number,
    'logEntries' : [{
        'logType' : String,
        'value' : Number,
        'dateStart' : Date,
        'dateEnd' : Date
    }]
  }],
})

module.exports = mongoose.model("Guild", schema)