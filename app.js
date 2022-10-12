const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const flash = require('connect-flash')
const passport = require('passport');
const User = require('./models/user');
const createElection = require('./models/createElection');
const bodyParser = require('body-parser');
const localStrategy = require('passport-local');
const methodOverride = require("method-override");
const passportLocalMongoose = require('passport-local-mongoose');



mongoose.connect('mongodb://rizzyking:08028345728@ac-cfg1yl9-shard-00-00.xyfbkly.mongodb.net:27017,ac-cfg1yl9-shard-00-01.xyfbkly.mongodb.net:27017,ac-cfg1yl9-shard-00-02.xyfbkly.mongodb.net:27017/?ssl=true&replicaSet=atlas-10z8g8-shard-0&authSource=admin&retryWrites=true&w=majority');

const app = express();

app.use(methodOverride("_method"));

//PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: 'ROVS is the best election platform for real',
    resave: false,
    saveUninitialized: false
}));

passport.use(new localStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});



app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req,res) => {
    res.render('index')
})

app.get('/home', (req,res) => {
    res.render('index')
})

app.get('/login', (req,res) => {
    res.render('login')
})

app.get('/dashboard',isLoggedIn, (req, res) => {
    createElection.find({}, function (err, data) {
        if (err) {
          console.log(err);
        } else {
          let showElections = [];
          data.forEach(function (d) {
            let authId = d.author.id;
            let reqId = req.user.id;
            // d.author.id == req.user._id
            if (reqId == authId) {
              showElections.push(d);
            }
          });
          res.render('dashboard', {title: "ROVS | Dashboard", found: showElections})
        }
      });
})

app.post('/login',passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login'
}), function(req, res){});

app.get('/register', (req,res) => {
    res.render('register')
})

app.post('/register', function(req, res){
    req.body.username
    req.body.password
    req.body.email
    req.body.fullName
    
    let newUser = new User({ username: req.body.username, 
                             email: req.body.email,
                             fullName: req.body.fullName
                        })
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register', {title: 'Register | '});
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('dashboard');
        });
    });

    console.log(newUser)
});

app.get("/dashboard/createElection", isLoggedIn, function (req, res) {
    res.render("createElection", { title: "Create Election | " });
  });

app.post("/dashboard/createElection", isLoggedIn, function (req, res) {
    // console.log(req.body.crypto);
    // console.log(req.body.amount);
    // console.log(req.user);
    var electionName = req.body.electionName;
    var votersCount = 0;
    var status = "Not Started";
    var author = {
      id: req.user._id,
      username: req.user.username,
    };
    var newElection = {
      electionName: electionName,
      totalVotes: totalVotes,
      status: status,
      author: author,
    };
    createElection.create(newElection, function (err, newElection) {
      if (err) {
        console.log(err);
        return res.redirect("/dashboard/createElection", { title: "create Election | " });
      } else {
        return res.redirect("/dashboard");
      } 
    });
    console.log(newElection);
  });
  

app.get("/dashboard/userdetails/:id", isLoggedIn, function (req, res) {
    User.findById(req.params.id, function (err, foundUser) {
      if (err) {
        res.redirect("../../dashboard");
      } else {
        res.render("userDetails", {
          title: "User Details | ",
          user: foundUser,
        });
      }
    });
  });

  app.get(
    "/dashboard/userdetails/:id/edit",
    isLoggedIn,
    function (req, res) {
      User.findById(req.params.id, function (err, foundUser) {
        if (err) {
          res.redirect("../../dashboard");
        } else {
          res.render("editUserDetails", {
            title: "Edit User Details | ",
            user: foundUser,
          });
        }
      });
    }
  );

  app.put("/dashboard/userdetails/:id", isLoggedIn, function (req, res) {
    let data = {
      username: req.body.username,
      email: req.body.email,
      fullName: req.body.fullName,
    };
    User.findByIdAndUpdate(req.params.id, data, function (err, updatedUser) {
      if (err) {
        res.send("error");
      } else {
        console.log(updatedUser);
        res.redirect(
          '/dashboard/userdetails/' + req.params.id
        );
      }
    });
  });

app.get('/dashboard/election/:id', isLoggedIn, function (req, res) {
    createElection.findById(req.params.id, function (err, foundElection) {
      if (err) {
        res.redirect("../../dashboard/operationhistory");
      } else {
        res.render("showElection", { found: foundElection, title: "Election" });
      }
    });
  });
  //LOGOUT
app.get('/logout', function(req, res){
    req.logout();
    // req.flash('success', 'Logged you out successfully')
    res.redirect('../../home')
});
  

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    };
    // res.send('Please Login First')
    res.redirect('../../../login');
};

app.listen(3000 || process.env.PORT, () => {
    console.log('Server has started......')
})