const express = require('express');
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');
const { isLoggedIn, isAdmin, validateUser } = require('../middleware');


router.route('/register')
    .get(users.renderRegistrationPage)
    .post(catchAsync(users.createUser));

router.route('/login')
    .get(users.renderLoginPage)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

router.route('/user')
    .get(isLoggedIn, catchAsync(users.renderUserPage))
    .put(isLoggedIn, catchAsync(users.updateUser));

router.route('/user/banned')
    .get(isLoggedIn, isAdmin, catchAsync(users.renderBannedList));

router.route('/user/banned/:user')
    .put(isLoggedIn, isAdmin, catchAsync(users.unbanUser));

router.get('/logout', users.logout);

router.put('/:litID/user/:user', isLoggedIn, isAdmin, catchAsync(users.banUser));

module.exports = router;