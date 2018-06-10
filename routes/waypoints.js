const express = require('express')
const router = express.Router()

const authCheck = (req, res, next) => {
  if(!req.user){
      res.redirect('/auth/login');
  } else if (req.user.routes.waypoints = undefined) {
      res.redirect('/')
  } else {
      next();
  }
};

router.get('/', authCheck, (req, res) => {
  res.render('waypoints', { user: req.user });
});

module.exports = router;