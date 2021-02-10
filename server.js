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
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://senyang:senyang123@cluster0.aapka.mongodb.net/Users_with_comments?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('index', {name: 'Jason'});
});

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', (req, res) => {

})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', (req, res) => {
    
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`);
})