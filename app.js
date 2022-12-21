require('dotenv').config();

const express = require('express');
const Joi = require('joi');

const app = express();
const PORT = process.env.PORT || 7378;

process.env.TZ = process.env.TIMEZONE || process.env.TZ;

const schema = Joi.object({
    token: Joi.string()
        .alphanum()
        .min(16)
        .max(64)
        .required()
})


app.use(express.json());


// Routes //

const launchRoute = require('./routes/launch.js');

const motd = require('./routes/motd.js');

const test = require('./routes/auth_test.js');

app.use('/api/launch', launchRoute);

app.use('/', motd);

app.use('/test', test);


// End Setup //

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/api/`);
})