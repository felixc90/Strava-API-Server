const fetch = require('node-fetch');
const dotenv = require('dotenv');
const User  = require('../models/User');
const Guild  = require('../models/Guild');

dotenv.config()

module.exports = {
    getNumActivePeriods : getNumActivePeriods,
    getRunData : getRunData,
    toPace : toPace,
    getStartOfPeriod : getStartOfPeriod
}

async function getNumActivePeriods(runs, unitOfTime) {
    let prev_run = {date: new Date()}
    let num_active_periods = 0;
    for (const curr_run of runs) {
        let difference = (getStartOfPeriod(prev_run.date, unitOfTime) - 
        getStartOfPeriod(curr_run.date, unitOfTime)) / (1000 * 3600 * 24)
        if (unitOfTime == "week") (difference = difference / 7)
        if ((unitOfTime == "day" && difference > 7) ||
            (unitOfTime == "week" && difference > 4)) {break}
        prev_run = curr_run
        num_active_periods += 1
    }
    return num_active_periods
}


async function getRunData(userId, unitOfTime, numPeriods) {
  const user = await User.findOne({discordId : userId})
  const runs = user.runs
  let runIndex = 0
  let dates = []
  let data = []
  let currDate = getStartOfPeriod(new Date(), unitOfTime)
  // count the number of last 'numPeriods' periods
  for (let i = 0; i < numPeriods; i++) {
    dates.unshift(currDate)
    let total = 0;
    // process each run that shares the same start as the current date's start
    while (runIndex < runs.length && 
      currDate.getTime() == getStartOfPeriod(runs[runIndex].date, unitOfTime).getTime()) {
      total += runs[runIndex].distance
      runIndex += 1
    }
    currDate = getStartOfPeriod(currDate - 1, unitOfTime)
    data.unshift(total)
  }
  dates = dates.map((date) => date.getDate() + '/' + 
  (date.getMonth() + 1))
  return [dates, data]
}

function getStartOfPeriod(d, unitOfTime) {
  d = new Date(d);
  if (unitOfTime === "day") {
    d.setUTCHours(0,0,0,0)
    return d;
  } else if (unitOfTime === "week") {
    d.setUTCHours(0,0,0,0)
    d.setUTCDate(d.getUTCDate() - d.getUTCDay() + (d.getUTCDay() == 0 ? -6:1));
    return d;
  } else if (unitOfTime === "month") {
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), 1);
  } else if (unitOfTime === "year") {
    return new Date(d.getUTCFullYear(), 0, 1);
  }
  console.log("Invalid unit of time")
}

function toPace(speed) {
    var min = Math.floor(Math.abs(speed));
    var sec = Math.floor((Math.abs(speed) * 60) % 60);
    return min + ":" + (sec < 10 ? "0" : "") + sec;
}
        