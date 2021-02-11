const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./model/user');

function initializePassport(passport) {
    const authenticateUser =  async (email, password, done) => {
            const user = await User.findOne({email: email});
            if(user == null) {
                return done(null, false, {message: 'No user found'})
            }
            try {
                if(await bcrypt.compare(password, user.password)) {
                    return done(null, user);
                } else {
                    return done(null, false, {message: 'Password incorrect'})
                }
            } catch(e) {
                return done(e);
            }
        }
    
    passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        User.findById(id, function(err, user) {
            done(err, user)
        })
    });
}

module.exports = initializePassport;