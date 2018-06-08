const express = require('express')
const router = express.Router()

const authCheck = (req, res, next) => {
  if(!req.user){
      res.redirect('/auth/login');
  } else {
      next();
  }
};

router.get('/waypoint/:id', authCheck, (req, res) => {
  res.render('waypoint', { user: req.user });
});

module.exports = router;