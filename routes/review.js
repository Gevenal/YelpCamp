var express = require('express');
var router = express.Router({ mergeParams: true });
var { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
var catchAsync = require('../utils/catchAsync');
var Review = require('../models/review');
var Campground = require('../models/campground');
var expressError = require('../utils/expressError');
var { reviewSchema } = require('../schemas.js');
var reviews = require('../controllers/reviews')

var expressError = require('../utils/expressError');




//post a review
router.post('/', validateReview, isLoggedIn, catchAsync(reviews.createReview))

//delete reviews
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview))

module.exports = router;