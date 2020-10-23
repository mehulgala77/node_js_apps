
const GoogleStrategy = require('passport-google-oauth20').Strategy
const User = require('../models/User')

const passportConfig = (passport) => {

    const responseHandler = async (accessToken, refreshToken, profile, done) => {
        
        const newUser = new User({
            googleId: profile.id,
            displayName: profile.displayName,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            image: profile.photos[0].value
        })

        try {
            
            const user = await User.findOne({
                googleId: profile.id
            })

            if (user) {
                done(null, user)
            } else {
                await newUser.save()
                done(null, newUser)
            }

        } catch (err) {
            console.error(err);
            done(err)
        }
    }

    // Create google O Auth strategy instance
    const googleStrategyInstance = new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback'
    }, responseHandler)

    passport.use(googleStrategyInstance)

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });
    
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}

module.exports = passportConfig

// ------------- Steps to register for Google OAuth --------------

// Steps to fetch for Goolge OAuth 
// 1. Go to Google Cloud Console
// 2. Create a project
// 3. Go to "Enable APIs and Services"
// 4. Go to Google+ API
// 5. Enable it.
// 6. Go to Credentials
// 7. Click on "Credentials in APIs & Services" link
// 8. Click on "Create Credentials"
// 9. Click on "OAuth Client Id"
// 10. It may ask you to set up app name on the consent page.
// 11. Select "Web app" as the application type.
// 12. Add Redirect URL to "http://localhost:3001/auth/google/callback"