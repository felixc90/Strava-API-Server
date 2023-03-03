const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const routes = require("./routes.js");
const cors = require('cors')
dotenv.config()

var app = express();

var url = process.env.MONGODB_CONNECT

mongoose
    .connect(url, {useNewUrlParser : true, useUnifiedTopology : true})
    .then(() => {
        app.use(express.json());
        app.use(cors({
            origin: 'http://localhost:3000'
        }))
        app.use("/user", routes);
        app.listen(process.env.PORT, () => {
            console.log('Your app is listening on port ' + process.env.PORT)
        })
    })


    
