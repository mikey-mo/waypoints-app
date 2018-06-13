const express = require('express')
const router = express.Router()
const User = require('../models/users.js')

const authCheck = (req, res, next) => {
  if(!req.user){
      res.redirect('/auth/login');
  } else {
      next();
  }
};

router.get('/', authCheck, (req, res) => {
  res.render('profile', { user: req.user });
});

router.post('/delete', authCheck, (req, res) => {
    User.findById({_id: req.user.id}, {}).then((user) => {
        array = user.routes;
        array.splice(req.body.index, 1)
        return array;
    }).then((array) => {
        User.findByIdAndUpdate({_id: req.user.id}, { $set: { routes: array }}).then(() => {
            res.redirect('./../profile');
        })
    }).catch((e) => {
        console.log('There was an error: ', e);
    })
})

module.exports = router;