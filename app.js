// Bring in module
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const passport = require('passport');

// Create app
const app = express();

// Load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

// Passport config
require('./config/passport')(passport);

// Database config
const db = require('./config/database');

// Mapping global promise -get rids of deprecation warning
mongoose.Promise = global.Promise;

// Connect to mongoose
/* Uses a promise so we need to use .then() */
mongoose.connect(db.mongoURI, {
    useMongoClient: true
}).then(() => console.log('MongoDB connected ...')).catch(err => console.log(err));

// Handlebar middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// BodyParser middleware
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Static folder for public ~ static assets (i.e. css, js, img)
app.use(express.static(path.join(__dirname, 'public')));

// Methodoverride middleware
app.use(methodOverride('_method'));

// Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport middleware (session and intialize)
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global var
app.use((req, res, next) => {
    // Flash success msg / error msg / error 
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null; // Only if logged in
    next();
});

// Index route
/* / is the home url */
app.get('/', (req, res) => {
    const title = 'Welcome';
    res.render('index', {
        title: title
    })
});

// About route
app.get('/about', (req, res) => {
    res.render('about');
});

// Use routes
app.use('/ideas', ideas);
app.use('/users', users);

// Create and listen to port
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

