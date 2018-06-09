const express = require('express')
const mongoose = require('mongoose');
const router = express.Router()
const Ninja = require('../models/ninjas.js')
const User = require('../models/users.js')
const bodyParser = require('body-parser');
const axios = require('axios');

// router.get('/ninjas/:id', (req, res) => {
//   Ninja.findById({_id: req.params.id}).then((ninja) => {
//     res.{ninja};
//   });
// });

router.get('/ninjas/:id', (req, res) => {
  Ninja.findById({ _id: req.params.id }).then((ninja) => {
    res.render('edit', { ninja });
  });
});

router.get('/users', (req, res) => {
  User.find({}).then((users) => {
    res.status(202).send(JSON.stringify(users, undefined, 2));
  }).catch((e) => {
    res.send(e);
  })
})

router.post('/ninjas', (req, res) => {
    var encodedAddress = encodeURIComponent(req.body.address);
    var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyBpsmQEFJ1UAww2q0_sJd9qIV3vEzTneqs`;
    axios.get(geocodeUrl).then((response) => {
      if (response.data.status === 'ZERO_RESULTS') {
        return new Error('Unable to find address.');
      }
      var name = req.body.name
      var lat = response.data.results[0].geometry.location.lat;
      var lng = response.data.results[0].geometry.location.lng;
      User.findOne({ _id: req.user.id }, {}).then((user) => {
        user.routes.waypoints.push({
          name,
          lat,
          lng,
          time: req.body.time
        });
        user.save();
    }).then(() => {
      res.status(200).redirect('./../profile')
    }).catch((e) => {
      if (e.code === 'ENOTFOUND') {
        console.log('Unable to connect to API servers.');
      } else {
        console.log('There was an error, ', e.message);
      }
    })
  })
});

router.put('/ninjas/:id', (req, res) => {
  Ninja.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body }).then(() => {
    Ninja.findOne({ _id: req.params.id }).then((ninja) => {
      res.status(200).send(ninja);
    });
  }).catch((e) => {
    console.log(e);
  });
});

router.delete('/ninjas/:id', (req, res) => {
  // res.send('<h1>This is a DELETE</h1>')
  Ninja.findByIdAndRemove({ _id: req.params.id }).then((deleted) => {
    res.status(200).send(`Deleted ${deleted.name}`);
  });;
})

router.get('/ninjas/delete/:id', (req, res) => {
  // res.send('<h1>This is a DELETE</h1>')
  Ninja.findByIdAndRemove({ _id: req.params.id }).then(() => {
    res.redirect('index');
  });
});

module.exports = router;