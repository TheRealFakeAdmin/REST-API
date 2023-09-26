const router = require('express').Router();

const fs = require('fs'),
    path = require('path');


const twitch = (req, res) => {
    let indexPath = path.join(__dirname, 'twitch/index.html'),
        indexContent = fs.readFileSync(indexPath, { encoding: 'utf-8' });

    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.send(indexContent);
}

const twitch_js = (req, res) => {
    let mainJsPath = path.join(__dirname, 'twitch/main.js'),
        mainJsContent = fs.readFileSync(mainJsPath, { encoding: 'utf-8' });

    res.setHeader('Content-Type', 'application/javascript').send(mainJsContent);
}

router.get([ '/index.html', '/' ], twitch);

router.get('/main.js', twitch_js);


module.exports = router;