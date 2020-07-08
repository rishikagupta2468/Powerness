var express = require('express');
app = express(),
  bodyParser = require('body-parser'),
  port = 3000,
  mongoose = require('mongoose'),
  passport = require('passport'),
  flash = require('connect-flash'),
  fileupload = require('express-fileupload'),
  LocalStrategy = require('passport-local'),
  Feed = require('./models/feed'),
  Comment = require('./models/comment'),
  User = require('./models/user'),
  methodOverride = require('method-override');

// Route Requires
var feedRoutes = require('./routes/feedRoutes');
var commentRoutes = require('./routes/commentRoutes');
var indexRoutes = require('./routes/indexRoutes');


mongoose.connect("mongodb://localhost:27017/change16", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
//app.use(fileupload());

// PASSPORT CONFIGURATION
app.use(require('express-session')({
  secret: "code it!",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// USER MIDDLEWARE to set currentUser for all templates
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use('/feeds', feedRoutes);
app.use('/feeds/:id/comments', commentRoutes);
app.use('/', indexRoutes);


// PORT
app.listen(port, function () {
  console.log(`Running at ${port}`);
});
