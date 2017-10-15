require("babel-register");
var bodyParser = require('body-parser');
var express = require('express');
var OAuthServer = require('express-oauth-server');
var HttpError = require("standard-http-error")
var memorystore = require('./models/memory/model');
memorystore = new memorystore();

var app = express();

app.oauth = new OAuthServer({
  debug: true,
  useErrorHandler: true,
  model: memorystore, // See https://github.com/oauthjs/node-oauth2-server for specification
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/authorize', app.oauth.authorize({authenticateHandler: {handle: (request, response) => {
  let username = request.body.username || request.query.username;
  if (!username) {
    throw new HttpError(400, 'Missing parameter: `username`');
  }

  let password = request.body.password || request.query.password;
  if (!password) {
    throw new HttpError(400, 'Missing parameter: `password`');
  }

  return memorystore.getUser(username, password);
}}}));

app.post('/token', app.oauth.token());

app.use(function(req, res) {
  res.send('Secret area');
});
// custom global error handler. This default error-handling middleware function is added at the end of the middleware function stack.
app.use(function (err, req, res, next) {
  console.error(err.stack || err)
  res.status(err.code || 500).send(err.message || '500')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})