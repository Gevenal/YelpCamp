if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

// console.log(process.env.SECRET);
const dbUrl = process.env.DB_URL
const express = require('express');
const session = require('express-session');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const flash = require('connect-flash');
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')
const MongoDBStore = require('connect-mongo');
const helmet = require('helmet')

const expressError = require('./utils/expressError');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const Review = require('./models/review');

const userRoutes = require('./routes/users')
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/review');

const url = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
//set up the database;
// mongoose.connect(dbUrl);
mongoose.connect(url);

//catch error of db
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log('database connected...');
})

//用express()函数创建express服务对象
const app = express();

app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const secret = process.env.SECRET || 'alittlesecret'

var store = new MongoDBStore({
    mongoUrl: url,
    secret: secret,
    touchAfter: 24 * 60 * 60
})

store.on('error', function (e) {
    console.log('session error', e);
})
const sessionConfig = {
    store: store,
    name: 'Hermes',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());
// app.use(helmet())


// const scriptSrcUrls = [
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://api.mapbox.com/",
//     "https://kit.fontawesome.com/",
//     "https://cdnjs.cloudflare.com/",
//     "https://cdn.jsdelivr.net",
// ];
// const styleSrcUrls = [
//     "https://kit-free.fontawesome.com/",
//     "https://stackpath.bootstrapcdn.com/",
//     "https://api.mapbox.com/",
//     "https://api.tiles.mapbox.com/",
//     "https://fonts.googleapis.com/",
//     "https://use.fontawesome.com/",
// ];
// const connectSrcUrls = [
//     "https://api.mapbox.com/",
//     "https://a.tiles.mapbox.com/",
//     "https://b.tiles.mapbox.com/",
//     "https://events.mapbox.com/",
// ];
// const fontSrcUrls = [];
// app.use(
//     helmet.contentSecurityPolicy({
//         directives: {
//             defaultSrc: [],
//             connectSrc: ["'self'", ...connectSrcUrls],
//             scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
//             styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
//             workerSrc: ["'self'", "blob:"],
//             objectSrc: [],
//             imgSrc: [
//                 "'self'",
//                 "blob:",
//                 "data:",
//                 "https://res.cloudinary.com/djkdzs4um/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
//                 "https://images.unsplash.com/",
//             ],
//             fontSrc: ["'self'", ...fontSrcUrls],
//         },
//     })
// );



app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

//store & unstore
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

//定义主页'/'的路由
app.get('/', (req, res) => {
    res.render('home');
})


app.all('*', (req, res, next) => {
    next(new expressError('Page Not Found', 404));
})

//error handler
app.use((err, req, res, next) => {
    var { status = 500 } = err;
    if (!err.message) err.message = 'Error Occurs!';
    res.status(status).render('error', { err });
})

const port = process.env.PORT || 3000;
//调用listen()开启服务器
app.listen(port, () => {
    console.log(`${port} is working..`);
})