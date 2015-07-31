var request = require('request');
var consumer_key = 'P2jERUxcHBleVPrrECziA';
var consumer_secret = 'An16FloSoNJjHRhiw0BY7pCtlXrm7vhjnULJgPyU';
var enc_secret = new Buffer(consumer_key + ':' + consumer_secret).toString('base64');

var oauthOptions = {
  url: 'https://api.twitter.com/oauth2/token',
  headers: {'Authorization': 'Basic ' + enc_secret, 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'},
  body: 'grant_type=client_credentials'
};

request.post(oauthOptions, function(e, r, body) {
  console.log(body)
});
