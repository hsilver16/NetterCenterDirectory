var passport = require('passport');
var User = require('../models/User');


exports.index = function(req, res) {
  res.render('index.ejs', {
	title : "Netter Center Directory",
	css_rels : [ "index.css" ],		
	js_files : [ "index.js" ]
  });
};

exports.validate = function(req, res, next) {
	// server side validation, maybe make this more specific
	req.assert('username', 'Your username is not a valid').len(4);
  req.assert('password', 'Your password is invalid').len(6);

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/');
  }

  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);
    if (!user) {
      req.flash('errors', { msg: info.message });
      return res.redirect('/');
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Success! You are logged in.' });
      res.redirect('/profile');
    });
  })(req, res, next);
};

exports.create_user = function(req, res, next) {
	console.log("in create user");
	req.assert('username', 'Username must be at least 4 characters long').len(4);
 	req.assert('password', 'Password must be at least 6 characters long').len(6);
 	req.assert('repassword', 'Passwords do not match').equals(req.body.password);

  var errors = req.validationErrors();

	if (errors) {
		req.flash('errors', errors);
		return res.redirect('/');
	}

  var user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  User.findOne({ username: req.body.username }, function(err, existingUser) {
    if (existingUser) {
      req.flash('errors', { msg: 'Account with that username already exists.' });
      return res.redirect('/');
    }
    user.save(function(err) {
      if (err) return next(err);
      req.logIn(user, function(err) {
        if (err) return next(err);
        res.redirect('/create-profile');
      });
    });
  });
};

exports.profile = function(req, res) {
  res.render('profile.ejs', {
	title : "Profile",
	css_rels : [ "nav.css", "profile.css" ],
	js_files : [ "search.js"]
  });
};

exports.search_results = function(req, res) {
  res.render('search-results.ejs', {
  title : "Results",
  css_rels : [ "nav.css", "search-results.css" ],
  js_files : ["search.js"]
  });
};

exports.logout = function(req, res) {
  req.logout();
  res.redirect('/');
};