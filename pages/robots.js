module.exports = (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'inline');
    // res.setHeader('Accept','plain/text');
    res.send("User-agent: *\nDisallow: /");
}