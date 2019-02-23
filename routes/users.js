const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Load user model
require('../models/Users');
const User = mongoose.model('users');

// User login route
router.get('/login', (req, res) => {
    res.render('users/login');
});

// Register user route
router.get('/register', (req, res) => {
    res.render('users/register');
});

// Login form post req
router.post('/login', (req, res, next) => {
    // Local is the strategy
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Register form post req
router.post('/register', (req, res) => {
    let errors = [];
    if (req.body.password != req.body.passwordConfirm) {
        errors.push({text: 'Passwords do not match'});
    }

    if (req.body.password.length < 5) {
        errors.push({text: 'Password must contain at least 5 characters'});
    }

    if (errors.length > 0) {
        res.render('users/register', {
            errors: errors,
            // Passing values back in to avoid re-entering information
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });
    } else {
        User.findOne({email: req.body.email})
        .then(user => {
            if(user) {
                req.flash('error_msg', 'That email is taken!');
                res.redirect('/users/register');
            } else {
                const newUser = new User({
                    name: req.body.name, 
                    email: req.body.email,
                    password: req.body.password
                });
        
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        // Handling errors
                        if (err) throw err;
        
                        // Set new hash to user password
                        newUser.password = hash;
        
                        // Saving newUser
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered! Try logging!');
                                res.redirect('/users/login');
                        })
                            .catch(err => {
                                console.log(err);
                                return;
                        });
                    });
                });
            }
        });

    }
});

// Logout the user from session
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'Successfully logged out!');
    res.redirect('/users/login');
});

module.exports = router;