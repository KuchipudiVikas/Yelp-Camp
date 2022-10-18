
const express = require('express');
const mongoose = require('mongoose')
const falsh = require('connect-flash')
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError')
const campgrounds = require('./routes/campgrounds')
const reviewsRoutes = require('./routes/reviews')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const userRoutes = require('./routes/users')
mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,

});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected!!")
})

const app = express();
app.engine('ejs', ejsMate)
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

app.use(express.static(path.join(__dirname, 'public')))



const sessionConfig = {
    secret: 'ohhelloman',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(falsh())
app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});




app.use(express.static('public'))
app.use('/', userRoutes)
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviewsRoutes)


app.get('/', (req, res) => {
    res.render('campgrounds/home');
})





app.all('*', (req, res, next) => {
    next(new ExpressError('page not found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'something went wrong' } = err;
    if (!err.message) RTCRtpReceiver.message = 'oh no something went wrong'
    res.status(statusCode).render('error', { err })
})



app.listen(3000, () => {
    console.log("serving port 5000")
})

