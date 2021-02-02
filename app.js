var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose"),
    passport = require('passport'),
    localStrategy = require('passport-local')
    ;

mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"))

var Camp = require("./models/campground");
var comment = require("./models/comment");
var user = require("./models/user");


app.use(require("express-session")({
        secret:"secret",
        resave:false,
        saveUninitialized: false
        }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser =req.user;
    next();
})

mongoose.connect("mongodb://localhost/YelpCamp");


//var seedDB = require("./seeds")
//seedDB()


app.get("/",function(req, res){
	res.render("campground/index");
});

app.get("/campground",function(req, res){
    Camp.find({},function(err, items){
        if(err) console.log(err);
        else {
              res.render("campground/campground",{cg:items});
             }
    })
});

app.get("/campground/new",isLoggedIn,function(req, res){
	res.render("campground/new");
});


app.post("/campground",isLoggedIn,function(req, res){
	Camp.create(req.body.camp,function(err, msg){
        if(err) console.log(err);
        else {
        res.redirect("/campground");}
    })
});


// show route
app.get("/campground/:id",isLoggedIn, function(req, res){
    Camp.findById(req.params.id).populate("comments").exec(function(err,item){
        if(err)console.log(err);
        else{
            res.render("campground/show",{info:item});
            }
    });
})

//nested comment route

app.get("/campground/:id/comment/new",isLoggedIn,function(req, res){
    Camp.findById(req.params.id,function(err, camp){
        if(err)
            console.log(err)
        else{ 
              res.render("comments/new",{camp:camp})}
    })
})

app.post("/campground/:id/comment",function(req, res){
    Camp.findById(req.params.id,function(err, camp){
        if(err)console.log(err)
        else{
    comment.create(req.body.comment,function(err, comment){
                if(err) consloe.log(err)
                else{
                    camp.comments.push(comment);
                    camp.save();
            res.redirect("/campground/"+camp._id)
                }
            })
        }
    })
})
//============
//auth routes
//===========

//register route
app.get("/register",function(req, res){
    res.render("register");
})

app.post("/register",function(req, res){
    var newUser = new user({username:req.body.username});
    user.register(newUser, req.body.password,function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/"); 
        });
    });
})
//login route
app.get("/login",function(req, res){
    res.render("login");
})

app.post("/login",passport.authenticate("local",{
    successRedirect:"/campground",
    failureRedirect:"/login"
}),function(req, res){
})
//logout route
app.get("/logout",function(req, res){
    req.logout();
    res.redirect("/");
})
//middle ware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login")
}


app.listen(2000, function(){
	console.log("server has started at port no 2000");
});