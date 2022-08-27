var Campground = require('../models/campground');
var { cloudinary } = require('../cloudinary')
var mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
var mapBoxToken = process.env.MAPBOX_TOKEN;
var geocoder = mbxGeocoding({ accessToken: mapBoxToken })

module.exports.index = async (req, res) => {
    var campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

module.exports.createCampground = async (req, res, next) => {
    var geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()

    if (!req.body.campground) throw new expressError('Invalid Input Data', 400);
    var campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'new camp made!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
    var campground = await Campground.findById(req.params.id).populate({ path: 'reviews', populate: { path: 'author' } }).populate('author');
    // console.log(campground);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground, msg: req.flash });
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    var campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground');
        return res.redirect('/campgrounds');
    }
    //  
    // var campground = await Campground.findById(id);

    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = (async (req, res) => {
    const { id } = req.params;
    // var campground = await Campground.findById(id);
    // if (!campground.author.equals(req.user._id)) {
    //     req.flash('error, you do not have authentication,')
    //     return res.redirect(`/campgrounds/${id}`)
    // }
    var campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    var imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    req.flash('success', 'successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
})
module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted campground');
    res.redirect('/campgrounds');
}