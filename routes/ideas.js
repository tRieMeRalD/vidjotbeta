const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Load helpers
const {ensureAuthenticated} = require('../helpers/off');

// Load idea model
/* . means the current directory we are in */
require('../models/Idea')
const Idea = mongoose.model('ideas');

// Add idea index page
router.get('/', ensureAuthenticated, (req, res) => {
    // Fetch all data from mongoose
    Idea.find({user: req.user.id}) // Only the ideas that corresponds to user id
        .sort({date:'desc'})
        .then(ideas => {
            res.render('ideas/index', {
                ideas: ideas
        });
    });
});

// Add idea form route
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

// Process idea form 
router.post('/', ensureAuthenticated, (req, res) => {
    let errors = [];
    
    if (!req.body.title) {
        errors.push({text: 'Title is required!'});
    }

    if (!req.body.details) {
        errors.push({text: 'Some details are required!'});
    }

    if (errors.length > 0) {
        res.render('/add', {
            errors: errors,

            // Saving the user input / readding it to the screen on render
            title: req.body.title,
            details: req.body.details
        });
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details,
            user: req.user.id
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Item successfully added');
                res.redirect('/ideas');
        });
    }
});

// Route for edit form passes in an 'id' which is a placeholder var
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    // Find one from mongoose and match with id
    Idea.findOne({
        _id: req.params.id // Get id from the .get url
    }).then(idea => {
        if(idea.user != req.user.id) {
            req.flash('error_msg', 'Not authorized');
            res.redirect('/ideas');
        } else {
            res.render('ideas/edit', {
                idea: idea
            });
        }
    });
});

// Edit form process (catching a put req doesn't matter if have the same path as long as the methods are different)
router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        // Grabbing the URL id
        _id: req.params.id
    }).then(idea => {
        // Changing the values -> setting old value = new values
        idea.title = req.body.title;
        idea.details = req.body.details;

        // Saving the changes and updating it to mongoose
        idea.save()
            .then(idea => {
                req.flash('success_msg', "Item change success!");
                res.redirect('/ideas');
        });
    });
});

// Delete idea (catching a deleting req)
router.delete('/:id', ensureAuthenticated, (req, res) => {
    // Deleting from mongoose
    Idea.remove({_id: req.params.id})
        .then(() => {
            req.flash('success_msg', 'Item deleted successfully!');
            res.redirect('/ideas');
    });
});


module.exports = router;