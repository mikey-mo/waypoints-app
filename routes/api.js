const express = require('express')
const router = express.Router()
const Ninja = require('../models/ninjas.js')

router.get('/ninjas/:id', (req, res) => {
  Ninja.findById({_id: req.params.id}).then((ninjas) => {
    res.status(200).send(ninjas);
  });
});

router.get('/ninjas/all', (req, res) => {
  Ninja.find({}).then((ninjas) => {
    res.status(202).send(JSON.stringify(ninjas, undefined, 2));
  }).catch((e) => {
    res.send(e);
  })
})

router.post('/ninjas', (req, res) => {
  Ninja.create(req.body).then((ninja)=> {
    res.send(ninja);
  }).catch((e) => {
    res.status(400).send(`Sorry: ${e.message}`);
  });
});

router.put('/ninjas/:id', (req, res) => {
  // res.send('<h1>This is a PUT</h1>')
  Ninja.findByIdAndUpdate({_id: req.params.id}, req.body).then(() => {
      Ninja.findOne({_id: req.params.id}).then((ninja) => {
      res.status(200).send(`Updated ${ninja.name}`);
    });
  });
});

router.delete('/ninjas/:id', (req, res) => {
  // res.send('<h1>This is a DELETE</h1>')
  Ninja.findByIdAndRemove({_id: req.params.id}).then((deleted) => {
    res.status(200).send(`Deleted ${deleted.name}`); 
  });;
})

module.exports = router;