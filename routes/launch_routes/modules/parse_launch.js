const { parse } = require("dotenv");

// Date Setup
const wkds = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
];

const mnths = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
];

/**
 * Adds the correct Ordinal Suffix to a number.
 * @param {number} i - Whole Number
 * @returns {string}
 */
function ordinal_suffix_of(i) { // src : https://gist.github.com/frank184/cb992e676e3aa85246dbcf1c2aaa3462
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

const parseSentence = (v, msg) => {
    let ln = v.win_open || v.t0,
        ld = new Date(ln),
        dt = new Date();

    msg = msg || "";
    msg += `There ${ld.valueOf() > dt.valueOf() ? "is" : "was"} a planned ${v.weather_condition !== null ? v.weather_condition.toLowerCase() : ""} launch of a ${v.provider.name !== null ? v.provider.name : ""} ${v.vehicle.name ? v.vehicle.name : ""} rocket flying ${v.name ? v.name : ""} on ${wkds[ld.getDay()]}, ${mnths[ld.getMonth()]} ${ordinal_suffix_of(ld.getDate())} at ${ld.getHours() % 12}:${ld.getMinutes().toString().padStart(2, "0")} ${(ld.getHours() < 12) ? "AM" : "PM"}.`; // :${ld.getSeconds().toString().padStart(2, "0")}
    msg += ` This should ${ld.valueOf() > dt.valueOf() ? "launch" : "have launched"} out of ${v.pad.name !== null ? v.pad.name + " at " : ""}${v.pad.location.name}${(v.pad.location.statename !== null || v.pad.location.country !== null) ? " in " : "."}${(v.pad.location.statename === null) ? "" : `${v.pad.location.statename}${(v.pad.location.country === null) ? "." : ", "}`} ${(v.pad.location.country === null) ? "" : v.pad.location.country + "."}`;

    return msg;
}

module.exports = parseSentence;
