const fs = require('fs'),

nouns = fs.readFileSync(require.resolve('./texts/english-nouns.txt'), {encoding:'utf8', flag:'r'}).toString().split('\n'),
adjectives = fs.readFileSync(require.resolve('./texts/english-nouns.txt'), {encoding:'utf8', flag:'r'}).toString().split('\n'),
verbs = fs.readFileSync(require.resolve('./texts/english-verbs.txt'), {encoding:'utf8', flag:'r'}).toString().split('\n'),
adverbs = fs.readFileSync(require.resolve('./texts/english-adverbs.txt'), {encoding:'utf8', flag:'r'}).toString().split('\n'),

regexpWords = require('./regexp-words'),
getRndWord = require('./get-random-word');


const getNoun = (num=1, regexp) => {
    const wrds = regexpWords(nouns, regexp),

    resp = getRndWord(num, wrds);

    return resp;
}

const getAdjective = (num=1, regexp) => {
    const wrds = regexpWords(adjectives, regexp),

    resp = getRndWord(num, wrds);

    return resp;
}

const getVerb = (num=1, regexp) => {
    const wrds = regexpWords(verbs, regexp),

    resp = getRndWord(num, wrds);

    return resp;
}

const getAdverb = (num=1, regexp) => {
    const wrds = regexpWords(adverbs, regexp),

    resp = getRndWord(num, wrds);

    return resp;
}


module.exports = {
    getNoun: getNoun,
    getAdjective: getAdjective,
    getVerb: getVerb,
    getAdverb, getAdverb
}