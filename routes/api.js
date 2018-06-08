const express = require('express')
const router = express.Router()
const Ninja = require('../models/ninjas.js')
const User = require('../models/users.js')
const bodyParser = require('body-parser');

// router.get('/ninjas/:id', (req, res) => {
//   Ninja.findById({_id: req.params.id}).then((ninja) => {
//     res.{ninja};
//   });
// });

router.get('/ninjas/:id', (req, res) => {
  Ninja.findById({_id: req.params.id}).then((ninja) => {
  res.render('edit', { ninja });
  });
});

router.get('/ninjas', (req, res) => {
  Ninja.find({}).then((ninjas) => {
    res.status(202).send(JSON.stringify(ninjas, undefined, 2));
  }).catch((e) => {
    res.send(e);
  })
})

router.post('/ninjas', (req, res) => {
  console.log(req.body);
  User.findOne({_id: req.user.id}, {}).then((user) => {
    user.routes.push({
      name: req.body.name,
      rank: req.body.rank
     });
     user.save();
    // console.log(user);
    // user.save();
  }).then((updatedUser) => {
    res.send(updatedUser);
  })
  // console.log(req.body);
  // Ninja.create({
  //   name: req.body.name,
  //   rank: req.body.rank,
  //   user_id: req.user.id
  // }).then((ninja)=> {
  //   res.send(ninja);
  // // res.redirect('../')
  // }).catch((e) => {
  //   res.status(400).send(`Sorry: ${e.message}`);
  // });
});

router.put('/ninjas/:id', (req, res) => {
  Ninja.findByIdAndUpdate({_id: req.params.id}, {$set: req.body}).then(() => {
      Ninja.findOne({_id: req.params.id}).then((ninja) => {
      res.status(200).send(ninja);
    });
  }).catch((e) => {
    console.log(e);
  });
});

router.delete('/ninjas/:id', (req, res) => {
  // res.send('<h1>This is a DELETE</h1>')
  Ninja.findByIdAndRemove({_id: req.params.id}).then((deleted) => {
    res.status(200).send(`Deleted ${deleted.name}`); 
  });;
})

router.get('/ninjas/delete/:id', (req, res) => {
  // res.send('<h1>This is a DELETE</h1>')
  Ninja.findByIdAndRemove({_id: req.params.id}).then(() => {
    res.redirect('index'); 
  });
});

module.exports = router;