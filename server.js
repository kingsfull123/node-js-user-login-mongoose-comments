if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
app.set('view engine', 'ejs');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./model/user');
const Comment = require('./model/comment');
const passport = require('passport');
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://senyang:senyang123@cluster0.aapka.mongodb.net/Users_with_comments?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const initializePassport = require('./passport-config');
initializePassport(passport);

app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
    res.render('index', {name: req.user.name, comments: req.user.comments});
});

app.post('/', async (req, res) => {
    const comment = new Comment({
        comment: req.body.comment,
        user: req.user._id
    })
    await comment.save();
    const relatedUser = await User.findById(comment.user);
    relatedUser.comments.push(comment);
    await relatedUser.save(function(err) {
        if(err) {console.log(err)}
        res.render('user', {name: relatedUser.name, comments: relatedUser.comments})
    })
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
            comment: req.body.comment
        })
        await user.save();
        console.log(user);
        res.redirect('/login')
    } catch(e) {
        console.log(e)
    }
})

// function checkAuthenticated(req, res, next) {
//     if(req.isAuthenticated()) {
//         return next()
//     }
//     res.redirect('/login')
// }

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})