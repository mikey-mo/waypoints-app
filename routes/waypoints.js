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
    if (req.user.routes[0] === undefined) {
    res.render('index')    
    } else {
    res.render('waypoints', { user: req.user, id: req.params.id });
    }
  });

  router.post('/delete/waypoint', authCheck, (req, res) => {
    int = parseInt(req.body.posId);
    User.findByIdAndUpdate({_id: req.user.id}, { $pull: { [`routes.${req.body.id}.waypoints`]: { pos_id: int }}}, { new: true}).then((user) => {
    res.redirect([`./../${req.body.id}`]);
    })
})

router.post('/movedown/waypoint', authCheck, (req, res) => {
    int = parseInt(req.body.posId);
    User.findById({_id: req.user.id}, {}).then((user) => {
        array = user.routes
        // console.log(array);
        element = array[req.body.id].waypoints.splice(req.body.index, 1);
        array[req.body.id].waypoints.splice((req.body.index + 1), 0, element[0]);
        // console.log(array)
        return array
    }).then((array) => {
        User.findByIdAndUpdate({_id: req.user.id}, { $set: { routes: array }}).then(() => {
            res.redirect([`./../${req.body.id}`]);
        })
    })
});

router.post('/moveup/waypoint', authCheck, (req, res) => {
    int = parseInt(req.body.posId);
    User.findById({_id: req.user.id}, {}).then((user) => {
        array = user.routes
        // console.log(array);
        element = array[req.body.id].waypoints.splice(req.body.index, 1);
        array[req.body.id].waypoints.splice((req.body.index - 1), 0, element[0]);
        // console.log(array)
        return array
    }).then((array) => {
        User.findByIdAndUpdate({_id: req.user.id}, { $set: { routes: array }}).then(() => {
            res.redirect([`./../${req.body.id}`]);
        })
    })
});

router.post('/add', authCheck, (req, res) => {
    backURL = req.header('Referer') || '/';
    var encodedAddress = encodeURIComponent(req.body.address);
    var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyBpsmQEFJ1UAww2q0_sJd9qIV3vEzTneqs`;
    axios.get(geocodeUrl).then((response) => {
        if (response.data.status === 'ZERO_RESULTS') {
            throw new Error('Unable to find address.');
            }
        posId = Math.random() * 10000;
        floorId = Math.round(posId);
        var name = req.body.name
        var lat = response.data.results[0].geometry.location.lat;
        var lng = response.data.results[0].geometry.location.lng;
        var object = { name, pos_id: floorId, location: {lat, lng}, locationString: lat + ', ' + lng, stopover: true, time: req.body.time};
        User.findOneAndUpdate({ _id: req.user.id }, { $push: { [`routes.${req.body.id}.waypoints`]: object}}).then((user) => {
        res.redirect([`${req.body.id}`])
        }).catch((e) => {
            console.log(e);
        });
    });
  });

router.post('/', (req, res) => {
    var encodedAddress = encodeURIComponent(req.body.address);
    var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=AIzaSyBpsmQEFJ1UAww2q0_sJd9qIV3vEzTneqs`;
    axios.get(geocodeUrl).then((response) => {
        if (response.data.status === 'ZERO_RESULTS') {
        throw new Error('Unable to find address.');
        }
        posId = Math.random() * 10000;
        floorId = Math.round(posId);
        var name = req.body.name
        var lat = response.data.results[0].geometry.location.lat;
        var lng = response.data.results[0].geometry.location.lng;
        var object = { waypoints: [{ name, pos_id: floorId, location: {lat, lng}, locationString: lat + ', ' + lng, stopover: true, time: req.body.time}] };
        User.findOne({ _id: req.user.id }, {}).then((user) => {
        user.routes.push(object);
        user.save();
    }).then(() => {
        res.status(200).redirect('./../waypoints/0')
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