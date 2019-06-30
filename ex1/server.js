const express = require('express');
const BasicStrategy = require('passport-http').BasicStrategy;
// const db = require('./db');
const http = require('http');
const calc = require('./calculator')

var port = 8080

// Create a new Express application.
var app = express();

var router = express.Router();

var passport = require('passport');

passport.use(new BasicStrategy(
    function (username, password, done) {
        if (username === "amazon" && password === "candidate") {
            return done(null, 'SUCCESS');
        }
        return done(null, false);
    }
));

// Serialized and deserialized methods when got from session
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});


// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/',function(req,res){
    res.send('AMAZON');
})
app.get('/secret',
    passport.authenticate('basic', {
        session: false
    }),
    function (req, res) {
        res.send(req.user);
    });

http.createServer(app).listen(port, function () {
    console.log('Express server listening on port ' + port);
});


app.get('/calc', function(req,res){
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    var search = url_parts.search;
    var func = ""
    if (search){
        func = search.slice(1);
    }
    var result = calc.calc(func);
    console.log(result);
    res.send(result);
})
