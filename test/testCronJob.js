var express = require("express");
var request = require("supertest");
var app = express();

// 定义路由
app.get('/fruit', function(req, res){
  res.send(200, { name: 'apple' });
});

describe('GET /fruit', function(){
  it('respond with json', function(done){
    request(app)
      .get('/fruit')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err){
          done(err);
        }
        console.log(JSON.stringify(res));
        //res.body.name.should.be.eql('apple');
        done();
      })
  });
});