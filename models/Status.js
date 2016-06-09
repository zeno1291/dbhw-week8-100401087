var db = require('../libs/db');
var GeneralErrors = require('../errors/GeneralErrors');


var Status = function(options) {
  this.SID = options.SID;
  this.Name = options.Name;
  this.Department = options.Department;
  this.Grade = options.Grade;
  this.Sex = options.Sex;
  this.Phone = options.Phone;
  this.Email = options.Email;
  this.ID = options.ID; //account

}; // many status

var Member = function(options) {

  this.id = options.id;
  this.name = options.name;
  this.password = options.password;
  this.account = options.account;

};

Status.getAll = function(cb) {

  db.select()
    .from('MemberStatus')
    .map(function(row) {
      return new Status({
        SID : row.SID,
        Name : row.Name,
        Department : row.Department,
        Grade : row.Grade,
        Sex : row.Sex,
        Phone :row.Phone,
        Email : row.Email,
        ID : row.ID
      });
    })
    .then(function(statusList) {
      cb(null, statusList);
    })
    .catch(function(err) {
      cb(new GeneralErrors.Database());
    });
}


Status.get = function(statusId, cb) {  //get file and output
  db.select()
    .from('MemberStatus')
    .where({
      ID : statusId
    })
    .map(function(row) {
      return new Status(row);

    })
    .then(function(statusList) {
      if(statusList.length) {
        cb(null, statusList[0]);
      } else {
        cb(null, new GeneralErrors.NotFound());
      }

    })
    .catch(function(err) {
      console.log(err);
      cb(new GeneralErrors.Database());
    });
}

Status.find1 = function(statusId,cb) {

  var a  = 'member.id';

    db().select()
    .from('MemberStatus').
    join('member',function(){

      this.on(a,db.raw('?',[statusId])).
      andOn('MemberStatus.ID',db.raw('?',[statusId]))
    })
    .map(function(row){
      var json = JSON.stringify(row);
      console.log('j'+json);

      return row;
    }).then(function(statusList) {
      if(statusList.length) {
        cb(null, statusList[0]);
      } else {
        cb(null, new GeneralErrors.NotFound());
      }

    })
    .catch(function(err) {
      console.log(err);
      cb(new GeneralErrors.Database());
    });
}


Status.prototype.record = function (cb) {

  console.log('id'+this.id);
  db('MemberStatus')
    .insert({
    SID : this.SID,
    Name : this.Name,
    Department : this.Department,
    Grade : this.Grade,
    Sex : this.Sex,
    Phone :this.Phone,
    Email : this.Email,
    ID : this.ID})
    .then(function(result) {
        //this.id = result[0]
        cb(null, this);
      }.bind(this))
      .catch(function(err) {
        console.log(err);
        cb(null, new GeneralErrors.Database());
      });

};

Status.prototype.upday = function (cb) {

  if(this.ID) {

    db('MemberStatus')
    .update({
      Name : this.Name,
      Grade : this.Grade,
      Phone :this.Phone,
      Email : this.Email
    })
    .where({
      ID : this.ID
    })
    .then(function() {
        cb(null);
      }.bind(this))
      .catch(function(err) {
        console.log(err);
        cb(null, new GeneralErrors.Database());
      })
  }

};




module.exports = Status;
