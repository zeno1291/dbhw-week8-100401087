var db = require('../libs/db');
var GeneralErrors = require('../errors/GeneralErrors');
var forAllAsync = require('../routes/forAllAsync').forAllAsync;
var async = require('async');


var Case = function(options){

  this.CID = options.CID;
  this.CName= options.CName;
  this.Date_1= options.Date_1;
  this.Time= options.Time;
  this.Week= options.Week;
  this.Description= options.Description;


};

var Schedule = function(options) {
  this.SID = options.SID;
  this.Mon_9_12 = options.Mon_9_12;
  this.Mon_13_17 = options.Mon_13_17;
  this.Tue_9_12 = options.Tue_9_12;
  this.Tue_13_17 = options.Tue_13_17;
  this.Wed_9_12 = options.Wed_9_12;
  this.Wed_13_17 = options.Wed_13_17;
  this.Thu_9_12 = options.Thu_9_12;
  this.Thu_13_17 = options.Thu_13_17;
  this.Fri_9_12 = options.Fri_9_12;
  this.Fri_13_17 = options.Fri_13_17;
  this.ID1 = options.ID1; //account

};

Case.get = function(transferCID,cb){

  db().select()
  .from('Case')
  .where({
    CID : transferCID
  })
  .map(function(row){
    return new Case(row); //new
  })
  .then(function(Caseresult){
    if(Caseresult.length){
      cb(null,Caseresult[0]);
    }
    else{
      cb(null, new GeneralErrors.NotFound());
    }
  })
  .catch(function(err) {
    console.log(err);
    cb(new GeneralErrors.Database());
  });

};

Case.getAll = function(cb){

    db().select()
    .from('Case')
    .map(function(row){
      return new Case(row); //row.CID.,row.
    })
    .then(function(Caselist){
      cb(null,Caselist);
    })
    .catch(function(err){
      cb(new GeneralErrors.Database());
    });

};

/*Case.search =function(mon,cb){

  console('do');
  mon.forEachAsync(function(next,index,concate,items,t){
  var  c =0;
  concate ='';
  items = ['Mon_9_12','Mon_13_17','Tue_9_12','Tue_13_17',
              'Wed_9_12','Wed_13_17','Thu_9_12','Thu_13_17','Fri_9_12','Fri_13_17'];
    console.log('ele'+index);

    //console.log('items'+items[i]);
    if(mon[index] == 0) // return i var + =item [i]
    {
      concate += items[index]+',';
      c =c+1;
      console.log('0');
    }

    console.log('con'+concate);
    console.log('c'+c);
    return concate;
  }).then(function(concate){
  console.log('c'+concate);
  cb(null,concate);
  }.bind(this))

};*/

Case.match = function(type, cb) {

  db.select('SID')
    .from('Member_ClassSchedule1')
    .whereRaw(type)
    .map(function(row) {
      return row.SID; //rtable sid
    })
    .then(function(statusList) {

      //console.log('s'+statusList);

      //console.log(statusList[0]);

      if(statusList.length) {
        cb(null, statusList);
      } else {
        cb(null, new GeneralErrors.NotFound());
      }

    })
    .catch(function(err) {
      console.log(err);
      cb(new GeneralErrors.Database());
    });
}


Case.match2 = function(list,cb)
{

  var arr=[];
  async.forEach(list,function(i,cb){

    db().select()
      .from('MemberStatus').
      join('Member_ClassSchedule1',function(){

        this.on('MemberStatus.SID',db.raw('?',i)).
        andOn('Member_ClassSchedule1.SID',db.raw('?',i));
      })
      .map(function(row){
        //var json = JSON.stringify(row);
        //console.log('j'+json);
        return row;
      }).then(function(List) {
        if(List.length) {

          arr.push(List); //use push to seperate
          cb(null);
        } else {
          cb(null, new GeneralErrors.NotFound());
        }

      })
      .catch(function(err) {
        console.log(err);
        cb(new GeneralErrors.Database());
      });


  },function(err){
    if(err) {
      console.log(err);
      cb(new GeneralErrors.Database());
    }
    else{
      //console.log('re'+result);
      //console.log('re'+a);
      cb(null,arr);
    }
  }

);




}


Case.prototype.record  = function(cb){ //def use =func

    db('Case')
    .insert({

      CName: this.CName,
      Date_1 : this.Date_1,
      Time:this.Time,
      Week:this.Week,
      Description:this.Description
    })
    .then(function(result){
      console.log('to here');
      cb(null,this);
    }) //bind this
    .catch(function(err){
      console.log(err);
      cb(null, new GeneralErrors.Database());
    })
};



module.exports = Case;
