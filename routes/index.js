var express = require('express');
var router = express.Router();
var Member = require('../models/Member');
//var acase = require('../models/acase');
var Case = require('../models/Case');
var async = require('async');
/* GET home page. */
router.get('/', function(req, res, next) {
  Case.getAll(function(err, caseist) {
    if(err) {
      next();
    } else {
      //這邊的做法是使用async each這樣的方式幫我們從caseist中一筆筆去找到member，然後新增一個key叫member在acase物件中
      async.each(caseist, function(acase, cb) {
        Member.get(acase.CID, function(err) {
          if(err) {
            cb(err);
          } else {

            cb(null);
          }
        });
      }, function(err){
        if(err) {
          res.status = err.code;
          next();
        } else {
          console.log('art'+caseist);;
          res.render('index',
          {
            member : req.session.member || null,
            caseist : caseist,
            target :null
          });
        }
      });

    }
  });

  /*res.render('index',
  {
    member : req.session.member || null,
    result : null,
    target :null

  });*/
});

router.post('/', function(req, res, next) {

    var words = req.body.search;

    Case.search(words, function(err,result){
      console.log('words');
      console.log(result);
      if(err)
      {
        next(err);
      }
      else{
        var target;
          if(result==null)
          {
            target = 0;
          }
          else{
            target = 1;
          }
        res.render('asearch',{
          member : req.session.member ||null,
          result:result,
          target : target
        });


      }


    });

});
module.exports = router;
