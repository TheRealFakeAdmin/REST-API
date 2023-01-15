require('dotenv').config();

const express = require('express');

const app = express();
const PORT = process.env.PORT || 7378;

process.env.TZ = process.env.TIMEZONE || process.env.TZ;


app.use(express.json());


// Routes //

const launchRoute = require('./routes/launch.js');

const motd = require('./routes/motd.js');

const test = require('./routes/auth_test.js');

const json = require('./routes/json.js');

app.use('/api/launch', launchRoute);

app.use('/', motd);

app.use('/test', test);

app.use('/api/json', json);

// End Setup //

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/api/`);
})
