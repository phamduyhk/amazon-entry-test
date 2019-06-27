var http = require('http');

http.createServer(function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/html'
    });
    response.write('AMAZON');
    response.end();
}).listen(8080);

var express = require('express');
var router = express.Router();

var passport = require('passport'); // 追記

router.get('/', function (req, res, next) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.write('AMAZON');
});

router.get('/secret', passport.authenticate('local'),
    function (req, res) {
        if (req.user == 'amazon' && req.password == 'candidate') {
            res.write('SUCCESS');
        } else {
            res.write("Fail");
            res.redirect('/' + req.user.username);
        }
    });



module.exports = router;