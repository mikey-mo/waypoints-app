const express = require('express')
const router = express.Router()
const passport = require('passport');

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/google', passport.authenticate('google', {
  scope: ['email']
}), (req, res) => {
  res.redirect('../public/index.html')
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/profile');
});

module.exports = router;