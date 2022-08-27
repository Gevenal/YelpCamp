var { campgroundSchema, reviewSchema } = require('./schemas');
var expressError = require('./utils/expressError')
var Campground = require('./models/campground')
var Review = require('./models/review')

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        //store the url
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in first');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    //validate our data before saving to Mongo
    var { error } = campgroundSchema.validate(req.body);
    if (error) {
        var msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    var { id } = req.params;
    var campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error, you do not have authentication,')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    var { id, reviewId } = req.params;
    var review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error, you do not have authentication,')
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}

module.exports.validateReview = (req, res, next) => {
    var { error } = reviewSchema.validate(req.body);
    if (error) {
        var msg = error.details.map(el => el.message).join(',');
        throw new expressError(msg, 400);
    } else {
        next();
    }
}