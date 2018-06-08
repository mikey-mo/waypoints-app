const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/users');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  })
});

passport.use(
  new GoogleStrategy({
      // options for google strategy
      clientID: keys.google.clientID,
      clientSecret: keys.google.clientSecret,
      callbackURL: '/auth/google/redirect'
  }, (accessToken, refreshToken, email, done) => {
      // passport callback function
      console.log('passport callback function created:');
      User.findOne({googleid: email.id}).then((currentUser) => {

        if (currentUser) {
          console.log('already a user');
          done(null, currentUser);
        } else {
          new User({
            username: email.displayName,
            googleid: email.id,
            email: email.emails[0].value
          }).save().then((newUser) => {
            console.log(newUser);
            done(null, newUser);
          });
        }
      })
  })
);
