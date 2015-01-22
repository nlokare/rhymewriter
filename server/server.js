var express = require('express');
var app = express();
var Generator = require('../rhymeGenerator/rhymeGenerator');
var bodyParser = require('body-parser');
var sendmail = require('sendmail')();
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var db = require('../server/db/db');
var methodOverride = require('method-override');

var port = process.env.PORT || 4568;
var host = process.env.HOST || '127.0.0.1';

var User = require('../server/users/userModel');
var Rhyme = require('../server/rhymes/rhymeModel');

var FACEBOOK_APP_ID =  process.env.APP_ID;
var FACEBOOK_APP_SECRET = process.env.APP_SECRET;

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: "http://rhymewriter.jit.su/auth/facebook/callback"
},
  function (accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
      return done(null, profile);
    });
  }
  ));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride());
app.use(express.static(__dirname + '/../client'));
app.listen(port);

app.get('/auth/facebook', passport.authenticate('facebook'), function (req, res) {
});

app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/#/' }),
  function (req, res) {
    User.find({profileUrl: req.user.profileUrl}, function (err, user) {
      if (err) {
        return err;
      }
      if (user.length === 0) {
        var newUser = new User({
          profileUrl: req.user.profileUrl,
          firstName: req.user.name.givenName,
          lastName: req.user.name.familyName
        });
        newUser.save(function (err, newUser) {
          res.redirect('/#/app/write');
        });
      } else {
        res.redirect('/#/app/write');
      }
    });
  });

app.get('/:rhyme', function (req, res) {
  Rhyme.find({word: req.params.rhyme}, function (err, rhymes) {
    if (err) {
      return err;
    }
    if (rhymes.length === 0) {
      Generator.getRhymes(req.params.rhyme)
        .then(Generator.objectifyRhymes)
        .then(function (data) {
          var rhymelist = Object.keys(data);
          var word = new Rhyme({
            word: req.params.rhyme,
            rhymes: rhymelist
          });
          word.save(function (err, newRhyme) {
            res.send(rhymelist);
          });
        })
        .catch(function (err) {
          console.log(err);
        });
    } else {
      res.send(rhymes[0].rhymes);
    }
  });
});

app.post('/send', function (req, res) {
  res.sendStatus(301);
  sendmail({
    from: 'test@rhymewriter.com',
    to: req.body.email,
    subject: 'Rhyme Writer: ' + req.body.title,
    content: req.body.body,
  }, function (err, reply) {
    console.log(err);
    console.dir(reply);
  });
});

app.post('/save', function (req, res) {
  console.log("SAVE: ", req.session.profile);
});

