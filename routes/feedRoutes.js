var express = require('express');
const multer = require('multer');
var cloudinary = require('cloudinary').v2;
var bodyParser = require('body-parser');
var app = express();

//const cloudinaryStorage = require("multer-storage-cloudinary");
var router = express.Router();
var { isLoggedIn, checkOwner } = require('../middleware/index');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

router.get('/', (req, res) => {
  // var arr = ["Aaron Peirsol", "Abbas Kiarostami", "Abdel Aziz Al-Hakim", "Abdel Nasser Assidi", "Abdoulaye Wade", "Alvaro Uribe", "Alyson Hannigan", "Amanda Beard", "Amanda Bynes", "Amanda Coetzer", "Amber Tamblyn", "Amelia Vega", "Amelie Mauresmo", "Amer al-Saadi", "Amy Pascal", "Ana Palacio", "Anastasia Kelesidou", "Anders Fogh Rasmussen", "Anderson Varejao", "Andre Agassi", "Andrei Konchalovsky", "Wolfgang Schuessel", "Woody Allen", "Wu Yi", "Xanana Gusmao", "Xavier Malisse", "Yann Martel", "Yannos Papantoniou", "Yao Ming", "Yasar Yakis"];

  // arr.forEach(function (name) {
  //   var newUser = new User({ username: name });
  //   User.register(newUser, "1234", function (err, user) {
  //     if (err) {
  //       console.log(err);
  //     }
  //     passport.authenticate("local")(req, res, function () {
  //       console.log(name);
  //     });
  //   })
  // });
  Feed.find({}, (err, allFeeds) => {
    if (err) {
      console.log("Error", err);
    } else {
      res.render('feeds/index', { feeds: allFeeds, pageTitle: 'Feeds', type: "none" });
    }
  });
});


// CREATE ROUTE
router.post('/', upload.single('image'), isLoggedIn, async (req, res) => {
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var name = req.body.name;
  var desc = req.body.description;
  var highlights = req.body.highlights;
  const image = await cloudinary.uploader.upload("./public/upload/save.jpg");
  var type = req.body.type;
  var newFeed = { name: name, image: image.secure_url, type: type, description: desc, author: author, highlights: highlights };
  Feed.create(newFeed, (err, feed) => {
    if (err) {
      console.log(err);
    } else {
      console.log("created feed");
      req.flash('success', `${feed.name} has been created.`);
      res.redirect('/feeds/' + feed._id);
    }
  });
});

//Find route
router.post("/search", (req, res) => {
  res.redirect("/feeds/search/" + req.body.type);
});


router.get("/search/:type", (req, res) => {
  Feed.find({}, function (err, found) {
    if (err) {
      console.log(err);
    }
    else {
      console.log(req.params.type);
      res.render('feeds/search_feed', { feeds: found, type: req.params.type });
    }
  });
});

// NEW ROUTE
router.get('/new', isLoggedIn, (req, res) => {
  res.render('feeds/new', { pageTitle: 'Add New Feed' });
});


// EDIT Route
router.get('/:id/edit', isLoggedIn, function (req, res) {
  Feed.findById(req.params.id, (err, feed) => {
    res.render('feeds/edit', { feed: feed, pageTitle: 'Edit Feed' });
  });
});





// UPDATE Route
router.put('/:id', checkOwner, function (req, res) {
  Feed.findByIdAndUpdate(req.params.id, req.body.feed, (err, feed) => {
    if (err) {
      res.redirect('/feeds');
    } else {
      res.redirect('/feeds/' + req.params.id);
    }
  })
});

// SHOW
router.get('/:id', function (req, res) {
  var all = [];
  Feed.find({}, (err, allFeeds) => {
    if (err) {
      console.log("Error", err);
    } else {
      all = allFeeds;
    }
  });
  Feed.findById(req.params.id).populate("comments").exec((err, found) => {
    if (err) {
      console.log("Feed not found", err);
    } else {
      console.log(found);
      res.render("feeds/show", { feed: found, all: all, pageTitle: found.name });
    }
  });
});

// DESTROY route
router.delete('/:id', checkOwner, function (req, res) {
  Feed.findByIdAndRemove(req.params.id, (err) => {
    if (err) {
      res.redirect('/feeds/:id');
    } else {
      res.redirect('/feeds');
    }
  });
});


module.exports = router;
