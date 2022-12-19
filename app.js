require('dotenv').config();

const express = require('express');
const Joi = require('joi');

const app = express();
const PORT = process.env.PORT || 7378;

const schema = Joi.object({
    token: Joi.string()
        .alphanum()
        .min(16)
        .max(64)
        .required()
})

process.env.TZ = "US/Eastern";

app.use(express.json());


// Routes //

const launchRoute = require('./routes/launch.js');

const motd = require('./routes/motd.js');

app.use('/api/launch', launchRoute);

app.use('/', motd);


// End Setup //

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/api/`);
})