var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/twitch.log', {flags : 'w'});
var log_stdout = process.stdout;

const log = (...d) => {
    const r = d.join(' ');
    log_file.write(util.format(r) + '\n');
    log_stdout.write(util.format(r) + '\n');
};


module.exports = log;