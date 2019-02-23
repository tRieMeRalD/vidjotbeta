const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load user models
const User = mongoose.model('users');

module.exports = function(passport) {
    // Defining local strategy & matching user
    passport.use(new LocalStrategy({usernameField: 'email'}, (email,password, done) => {
        User.findOne({
            // Matching login email with database
            email: email
        }).then(user => {
            if (!user) {
                return done(null, false, {message: 'No user found'});
            }

            // Match password using bcrypt hash
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) throw err;

                // If password matches
                if (isMatch) {
                    // Return no err and a matched user
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Incorrect password or username'});
                }
            });
        });       
    }));

    // Serialize and deserialize passwordjs
    /* Generates session only during login sessions and creates cookie */
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });
}
