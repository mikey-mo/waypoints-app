const express = require('express')
const router = express.Router()
const User = require('../models/users.js')
const bodyParser = require('body-parser');
const axios = require('axios');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId();

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

router.get('/:id', authCheck, (req, res) => {
    res.render('waypoints', { user: req.user, id: req.params.id });
  });

router.post('/', (req, res) => {
    var encodedAddress = encodeURIComponent(req.body.address);
    var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyBpsmQEFJ1UAww2q0_sJd9qIV3vEzTneqs`;
    axios.get(geocodeUrl).then((response) => {
        if (response.data.status === 'ZERO_RESULTS') {
        throw new Error('Unable to find address.');
        }
        var name = req.body.name
        var lat = response.data.results[0].geometry.location.lat;
        var lng = response.data.results[0].geometry.location.lng;
        var object = { waypoints: [{ name, location: {lat, lng}, time: req.body.time}] };
        User.findOne({ _id: req.user.id }, {}).then((user) => {
        user.routes.push(object);
        user.save();
    }).then(() => {
        res.status(200).redirect('./../waypoints')
    }).catch((e) => {
        if (e.code === 'ENOTFOUND') {
        console.log('Unable to connect to API servers.');
        } else {
        console.log('There was an error, ', e.message);
        }
    })
    })
    });

    module.exports = router;