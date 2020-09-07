
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

const User = require('../models/user')

const config = (passport) => {

    const newLocalStrategy = new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {

        try {

            // Match User
            const user = await User.findOne({email})
            if (!user) {
                return done(null, false, { message: 'Email is not registered' })
            }

            // Match Password
            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return done(null, false, { message: 'Password is invalid' })
            }

            return done(null, user)

        } catch(err) {
            console.error(err);
            throw err
        }

    })

    passport.use(newLocalStrategy)

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}

module.exports = config