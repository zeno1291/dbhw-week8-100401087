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

Status.get(req.session.member.id,function(err,status){

    if(err)
    {
      console.log(err);
      next();
    } else {
      res.render('statusshow', {
        member : req.session.member || null,
        status : status,
        statuslist :null
      });
    }
  });

});

router.post('/:show',function(req,res){
  if(!req.session.member) {

    res.redirect('/');

  }

  else{

      Status.getAll(function(err,statuslist){

        if(err) {
          res.status = err.code;
          res.json(err);
        }

        else{
          console.log('list:'+statuslist);
          console.log('list:');
          console.log(statuslist);
          console.log('listttttt:');
          console.log('list:'+statuslist[0]);
          console.log('listID:'+statuslist[0].SID);

          res.render('allstatus',{

            statuslist: statuslist
        });

        }
      });

  }

});

module.exports = router;
