const router = require('express').Router();

const fs = require('fs'),
    path = require('path');


const launch = (req, res) => {
    let indexPath = path.join(__dirname, 'launches/index.html'),
    indexContent = fs.readFileSync(indexPath, { encoding: 'utf-8' });

    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.send(indexContent);
}

const launch_js = (req, res) => {
    let mainJsPath = path.join(__dirname, 'launches/main.js'),
    mainJsContent = fs.readFileSync(mainJsPath, { encoding: 'utf-8' });

    res.setHeader('Content-Type', 'application/javascript').send(mainJsContent);
}

router.get([ '/index.html', '/' ], launch);

router.get('/main.js', launch_js);


module.exports = router;
