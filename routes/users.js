var express = require('express')
var router = express.Router()
var catchAsync = require('../utils/catchAsync')
var User = require('../models/user')
var passport = require('passport')
var users = require('../controllers/users')
router.get('/register', users.renderRegister)

router.post('/register', catchAsync(users.register))

router.get('/login', users.renderLogin)
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'welcome back')
    var redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
})

router.get('/logout', users.logout)

module.exports = router;