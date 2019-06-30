var express = require('express');
var BasicStrategy = require('passport-local').BasicStrategy;
var db = require('./db');
var http = require('http');

var port = 8080

// Create a new Express application.
var app = express();

var router = express.Router();

var passport = require('passport');

passport.use(new BasicStrategy(
    function (username, password, done) {
        if (username === "amazon" && password === "candidate"){
            return done(null, username);
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


// Define a middleware function to be used for every secured routes
var auth = function (req, res, next) {
    if (!req.isAuthenticated())
        res.send(401);
    else
        next();
};

app.get('/private',
    passport.authenticate('basic', {
        session: false
    }),
    function (req, res) {
        res.json(req.user);
    });

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({
    extended: true
}));
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));



// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

// Define routes.
app.get('/',
    function (req, res) {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        res.write('AMAZON');
    });

app.get('/test', auth, function (req, res) {
    res.send([{
        name: "user1"
    }, {
        name: "user2"
    }]);
});


app.post('/secret',
    passport.authenticate('local', {
        failureRedirect: '/fail'
    }),
    function (req, res) {
        res.write("SUCCESS");
    });

app.get('/logout',
    function (req, res) {
        req.logout();
        res.redirect('/');
    });

app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
        res.render('profile', {
            user: req.user
        });
    });

app.get('/test', auth, function (req, res) {
    res.send([{
        name: "user1"
    }, {
        name: "user2"
    }]);
});

app.post('/login', passport.authenticate('local'), function (req, res) {
    res.send(req.user);
});

http.createServer(app).listen(port, function () {
    console.log('Express server listening on port ' + port);
});
