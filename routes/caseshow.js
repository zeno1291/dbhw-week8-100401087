var express = require('express');
var router = express.Router();
var Case = require('../models/Case');
var async = require('async');

router.get('/', function(req, res) {
  if(!req.session.member) {
    res.redirect('/');
  }


  Case.getAll(function(err,caselist){

    if(err) {
      res.status = err.code;
      res.json(err);
    }

    else{
      res.render('caseshow',{
        member : req.session.member || null, //EVEY RENDER WILL NEED member or won't show
        caselist: caselist
    });

    }
  });

});



/*router.post('/:show',function(req,res){
  if(!req.session.member) {

    res.redirect('/');

  }

  else{
    Case.get(req.session.member.id,function(err,case){

        if(err)
        {
          console.log(err);
          next();
        } else {
          res.render('statusshow', {
            member : req.session.member || null,
            case : status,
            caselist :null
          });
        }
      });


  }

});*/

module.exports = router;
