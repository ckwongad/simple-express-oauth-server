var bodyParser = require('body-parser');
var express = require('express');
var OAuthServer = require('express-oauth-server');
var memorystore = require('./models/memory/model')

var app = express();

app.oauth = new OAuthServer({
  debug: true,
  model: new memorystore(), // See https://github.com/oauthjs/node-oauth2-server for specification
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(app.oauth.authorize());

app.use(function(req, res) {
  res.send('Secret area');
});
// custom global error handler. This default error-handling middleware function is added at the end of the middleware function stack.
app.use(function (err, req, res, next) {
  console.error(err.stack || err)
  res.status(500).send('500')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})