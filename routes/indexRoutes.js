var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Feed = require('../models/feed');
const multer = require('multer');
var mongoose = require('mongoose');
var cloudinary = require('cloudinary').v2;
var { isLoggedIn } = require('../middleware/index');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// INDEX ROUTEs
router.get('/', function (req, res) {
  res.render('landing', { pageTitle: 'Home' });
});

cloudinary.config({
  cloud_name: 'dk96tpgwo',
  api_key: '257327353339548',
  api_secret: 'c4ItASdO3ykmYH5T5U8Ga2q-VBM'
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/upload')
  },
  filename: function (req, file, cb) {
    cb(null, "save.jpg");
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/jpg|jpe|jpeg|png$i/)) {
      cb(new Error('File is not supported'), false);
      return;
    }
    cb(null, true);
  }
})

var upload = multer({ storage: storage });


// ===================
// AUTH ROUTES
// ===================
router.get('/register', function (req, res) {
  res.render('register', { pageTitle: 'Register' });
});

router.post('/register', upload.single('image'), async function (req, res) {
  const result = await cloudinary.uploader.upload("./public/upload/save.jpg");
  var newUser = new User({ username: req.body.username, image: result.secure_url });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      req.flash("error", err.message);
      return res.redirect('/register');
    }
    passport.authenticate("local")(req, res, function () {
      req.flash("success", "Welcome!! " + user.username);
      res.redirect('/feeds');
    });
  })
});
// ===================
// LOGIN ROUTES
// ===================

router.get('/login', function (req, res) {
  res.render('login', { pageTitle: 'Login' });
});
router.post('/login', passport.authenticate("local", {
  failureRedirect: '/login'
}), function (req, res) {
  req.flash("success", "Welcome back to iConnect");
  res.redirect('/feeds');
});

// ===================
// LOGOUT ROUTES
// ===================

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});
// ===================
//      PROFILE
// ===================
router.get('/profile/:id', function (req, res) {
  Feed.find({}, (err, allFeeds) => {
    if (err) {
      console.log("Error", err);
    } else {
      res.render('profile/show', { posts: allFeeds });
    }
  });
});


router.post('/profile/:id', upload.single('image1'), async function (req, res) {
  const execSync = require("child_process").execSync;
  var run;
  var arr = [];
  try {
    run = execSync('python ./FaceRecognition/recognition.py').toString();
    console.log(run);
    // var s = String;
    // s = "";
    // for (var i = 0; i < run.length; i++) {
    //   if (run[i] == ',') {
    //     arr.push(s);
    //     // console.log("in loop" + s);
    //     s = "";
    //   }
    //   else {
    //     if ((run[i] >= 'a' && run[i] <= 'z') || (run[i] >= 'A' && run[i] <= 'Z') || (run[i] == ' ') || (run[i] == '-')) {
    //       if (s.length == 0 && run[i] == ' ') {

    //       } else {
    //         s = s + run[i];
    //       }
    //     }
    //   }
    // }
    // if (s.length > 0) {
    //   arr.push(s);
    // }
    // arr.forEach(function (tt) {
    //   console.log(tt);
    //   console.log("inside loop");
    // });

  } catch (ex) {
    console.log(ex.stdout);
  }
  const img = await cloudinary.uploader.upload("./public/upload/processed.jpg");
  // var tag = [{
  //   id: String,
  //   username: String
  // }];
  // arr.forEach(function (names) {
  //   User.findOne({ username: names }, function (err, found) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       console.log("tag user found");
  //       var tagged = {
  //         id: found._id,
  //         username: names
  //       }
  //       tag.push(tagged);
  //     }
  //   });
  // });
  Feed.find({}, (err, allFeeds) => {
    if (err) {
      console.log("Error", err);
    } else {
      res.render('profile/show1', { posts: allFeeds, imgUrl: img.secure_url, run: run });
    }
  });
});

module.exports = router;
