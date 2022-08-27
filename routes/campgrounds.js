var express = require('express');
//single routing
var router = express.Router();
var catchAsync = require('../utils/catchAsync');
var expressError = require('../utils/expressError');
var Campground = require('../models/campground');
var { campgroundSchema } = require('../schemas.js');
var { isLoggedIn, isAuthor, validateCampground } = require('../middleware')
var campgrounds = require('../controllers/campgrounds')
var multer = require('multer')
var { storage } = require('../cloudinary')
var upload = multer({ storage })

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, campgrounds.createCampground)


router.get('/new', isLoggedIn, campgrounds.renderNewForm)

//look up corresponding id in database
router.get('/:id', catchAsync(campgrounds.showCampground))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

//
router.put('/:id', isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))


module.exports = router;