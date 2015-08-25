var validate = require('../lib/middleware.js');
var express = require('express');
var bodyParser = require('body-parser');
var request = require('supertest');
var expect = require('chai').expect;

// We build a simple express test in order to test the middleware
//
var app = express();

app.use(bodyParser.json());

app.param('testParam', validate.param({
  type: Number, required: true
}));

app.get('/param/:testParam', function(req, res) {
  res.sendStatus(200);
});

app.get('/query',
  validate.query({
    'test': { type: String, match: /^.*?test$/i }
  }),
  function(req, res) {
    res.status(200).json(req.query);
  }
);

app.post('/post',
  validate.body({
    'test': { type: String, match: /^.*?test$/i }
  }),
  function(req, res) {
    res.status(200).json(req.body);
  }
);

// Not found route
app.use(function(req, res, next) {
  res.status(400).json({ error: 'not-found' });
});

// Error handler
app.use(function(err, req, res, next) {
  if (err.constructor.name == 'ValidationError') {
    return res.status(400).json({error: 'validation-error', keyPath: err.keyPath.join('.'), message: err.message});
  }
  res.status(500).json({error: 'internal-server-error'});
});

describe('middlewares', function() {

  it ('should come back with 400 if param does not match schema', function(done) {
    request(app)
    .get('/param/test')
    .expect(400, function(err, res) {
      expect(res.body).to.have.property('error').equal('validation-error');
      done(err);
    });
  });

  it ('should come back with 200 if param matches schema', function(done) {
    request(app)
    .get('/param/123')
    .expect(200, done);
  });

  it ('should come back with 400 if query matches schema', function(done) {
    request(app)
    .get('/query?test=nonmatching')
    .expect(400, function(err, req) {
      expect(req.body).to.have.property('error').equal('validation-error');
      done(err);
    });
  });

  it ('should come back with 200 and correct body if query matches schema', function(done) {
    request(app)
    .get('/query?test=myTest')
    .expect(200, function(err, res) {
      expect(res.body).to.have.property('test').equal('myTest');
      done(err);
    });
  });

  it ('should come back with 400 if post body does not match schema', function(done) {
    request(app)
    .post('/post')
    .send({ test: 'nonmatching' })
    .expect(400, function(err, res) {
      expect(res.body).to.have.property('error').equal('validation-error');
      done(err);
    });
  });

  it ('should come back with 200 and correct body set if post body matches schema', function(done) {
    request(app)
    .post('/post')
    .send({ test: 'myTest' })
    .expect(200, function(err, res) {
      expect(res.body).to.have.property('test').equal('myTest');
      done(err);
    });
  });

});
