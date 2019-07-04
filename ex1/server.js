const express = require('express');
const BasicStrategy = require('passport-http').BasicStrategy;
// const db = require('./db');
const http = require('http');
const calc = require('./calculator');
const db = require('./dbUtils');

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

app.get('/', function (req, res) {
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


app.get('/calc', function (req, res) {
    var url = require('url');
    let q = req.query;
    var url_parts = url.parse(req.url, true);
    var search = url_parts.search;
    var func = ""
    if (search) {
        func = search.slice(1);
    }
    var result = calc.calc(func);
    res.send(result);
})

app.get('/stocker', function (req, res) {
    let query = req.query;
    console.log(req.query);
    let func = query["function"];
    let name = query["name"];
    let amount = query["amount"];
    let price = query["price"];
    try {
        if (func == 'addstock') {
            if(amount){
                if (amount != parseInt(amount, 10)||amount<0) {
                    res.send('ERROR');
                }
            }
            else{
                db.addstock(name, amount);
                res.end();
            }
        } else if (func == 'checkstock') {
            db.checkstock(name, {}).then(function (data) {
                console.log(data)
                data.forEach(function (item) {
                    let str = ""
                    str = item.name + ":" + item.amount + "\n"
                    res.write(str);
                })
                res.end()
            })
        } else if (func == 'sell') {
            db.sell(name,amount,price);
            res.end();

        } else if (func == 'checksales') {
            db.checksales().then(function(docs){
                let sales = 0;
                docs.forEach(function(item){
                    if(item.sale){
                        sales += item.sale;
                    }
                })
                res.write("salse:"+sales);
                res.end();
            })
        } else if (func == 'deleteall'){
            db.deleteall();
            res.end();
        }
         else {
            res.send('ERROR')
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).json({
            msg: err.message
        });
    }
})
