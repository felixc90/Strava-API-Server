const fetch = require('node-fetch');
const dotenv = require('dotenv');
const User  = require('../models/User');
const Guild  = require('../models/Guild');

dotenv.config()

const authLink = "https://www.strava.com/oauth/token"

module.exports = {
    updateUsers : updateUsers,
    updateUser : updateUser,
    reAuthorize : reAuthorize
}

// updates every user in the guild
async function updateUsers(guildId) {
  const guild = await Guild.findOne({guildId: guildId})
  const users = await User.find({discordId : { $in: guild.members.map(member => member.id) } })
  for (const user of users) {
    await updateUser(user);
  }
}

async function updateUser(user) {
  console.log("updating " + user.name + "...")
  const accessToken = await reAuthorize(user.refreshToken);
  const newRuns = []
  await getActivities(newRuns, accessToken, user.lastUpdated, 1);
  user.runs = [...newRuns, ...user.runs];

  newRuns.forEach(newRun => {
    user.totalDistance += newRun.distance;
    user.totalTime += newRun.time;
    user.totalRuns += 1;
    if (!user.longestRun.id || newRun.distance >= user.longestRun.distance) {
        user.longestRun = newRun;
    }

  })
  user.lastUpdated = new Date();
  await user.save();
}

// returns an access token for the given refresh token
async function reAuthorize(refreshToken) {
  return await fetch(authLink, {
    method: 'post',
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        client_id: '71610',
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
    })
  })
  .then(res => res.json())
  .then(json => json.access_token)
}


// updates data for a single user
async function getActivities(newRuns, accessToken, lastUpdated, page) {
  let d = new Date(lastUpdated)
  const activitiesLink = `https://www.strava.com/api/v3/athlete/activities?access_token=${accessToken}&page=${page}&after=${d.getTime() / 1000}`
  await fetch(activitiesLink)
  .then(res => res.json())
  .then(async (data) => {
    if (data.length == 0) return
    if (data.message === 'Rate Limit Exceeded') {
      console.log(data.message)
      return;
    }
    for (const activity of data) {
      if (activity.type != "Run") continue;
      const newRun = {
        'id' : activity.id,
        'name' : activity.name,
        'startLatlng' : activity.start_latlng,
        'endLatlng' : activity.end_latlng,
        'date' : activity.start_date,
        'time' : activity.moving_time / 60,
        'distance' : activity.distance / 1000,
        'summaryPolyline' : activity.map.summary_polyline,
      }
      newRuns.unshift(newRun)
    }
    // recursively fetch activities
    await getActivities(newRuns, accessToken, lastUpdated, page + 1)
  })
}