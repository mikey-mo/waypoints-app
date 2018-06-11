const express = require('express')
const router = express.Router()
const passport = require('passport');

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/google', passport.authenticate('google', {
  scope: ['email']
}), (req, res) => {
  res.redirect('/')
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});

module.exports = router;