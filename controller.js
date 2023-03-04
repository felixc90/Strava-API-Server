const fetch = require('node-fetch');
const dotenv = require('dotenv');
const Guild  = require('./models/Guild');
const User  = require('./models/User');
const { updateUser } = require('./utils/update')

dotenv.config()

const authLink = "https://www.strava.com/oauth/token"

// 'register' route
exports.register = async (req, res) => {
  // get code from request query
  const code = req.query.code;
  // req.params contains userId and guildId
  authoriseUser(req.params, code);
  res.send({message: "New user authorised!"});
}

// 'register' controller function
function authoriseUser(params, code) {
  fetch(authLink, {
    method: 'post',
    headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        client_id: '71610',
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code'
    })
  }).then(res => res.json())
    .then(async data => {
      // create new user
      const region = [data.athlete.city, data.athlete.state, data.athlete.country].filter(text => text).join(', ');
      let lastUpdated = new Date();
      lastUpdated.setFullYear(lastUpdated.getFullYear() - 1);
      const user = new User({
        'stravaId' : data.athlete.id,
        'discordId' : params.userId,
        'joinedAt' : new Date(),
        'createdAt' : data.athlete.created_at,
        'region' : region,
        'sex' : data.athlete.sex,
        'refreshToken' : data.refresh_token,
        'name' : `${data.athlete.firstname} ${data.athlete.lastname}`,
        'username' : params.username,
        'profile' : data.athlete.profile,
        'totalRuns' : 0,
        'totalDistance' : 0,
        'totalTime' : 0,
        'runs' : [],
        'lastUpdated' : getStartOfPeriod(lastUpdated, 'year')
      })
      // find guild with given guild id
      let guild = await Guild.findOne({guildId : params.guildId})
      // add user to guild if user is not currently a member
      if (!guild.members.map(member => member.id).includes(params.userId)) {
        guild.members.push({
          'id' : user.discordId,
          'joinedGuildAt' : new Date(),
          'totalExp' : 0,
          'modifiers' : [],
          'mostRecentRunId' : -1,
          'logEntries' : []
        })
        await guild.save()
      }
      await user.save()
      await updateUser(user);
      console.log(`${params.username} added to Achilles!`)
    }
  )
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