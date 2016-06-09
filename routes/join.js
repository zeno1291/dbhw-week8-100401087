var express = require('express');
var router = express.Router();
var Member = require('../models/Member');
var Status = require('../models/Status');
var async = require('async');

router.get('/', function(req, res) {
  if(!req.session.member) {
    res.redirect('/');
  }

  //var json = JSON.stringify(req.session.member);
  //console.log('j'+json);
  console.log('execute');
Status.find1(req.session.member.id,function(err,status){

  var json = JSON.stringify(status);
  console.log('11j'+json);
  console.log('execute2');
    if(err)
    {
      console.log(err);
      next();
    } else {
      res.render('join', {
        member : req.session.member || null,
        status : status
      });
    }
  });

});

module.exports = router;
