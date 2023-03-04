# Strava-API-Server

This github repository acts as a helper for the project: https://github.com/felixc90/Strava-Discord-Bot
This is set up as a separate Render project and includes only one route. When a new user attempts to register to the Strava Discord Bot, 
a code is given as response from the Strava API and this code is integrated into a server API route so that the program may have access
to the new user's reauthorisation code and hence, the program can continuously read each athlete's data without having to re-register.
