var express = require('express');
var bodyParser = require('body-parser');
var app = express();

function valid(options) {
  return (
    'email' in options &&
    'subject' in options &&
    'message' in options &&
    (options.email = options.email.trim()).length &&
    (options.subject = options.subject.trim()).length &&
    (options.message = options.message.trim()).length &&
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(options.email)
  );
}

function sendEmail(options) {
  return true;
}

app.set('port', (process.env.PORT || 5000));

app.use('/js', express.static(__dirname + '/public/js'));
app.use('/css', express.static(__dirname + '/public/css'));
app.use('/img', express.static(__dirname + '/public/img'));

app.get('/favicon.ico', function(request, response) {
  response.sendFile(__dirname + '/public/img/favicon.ico');
});

app.use(bodyParser.urlencoded({ extended: false }));
app.post('/contact', function(request, response) {
  var body = request.body;
  if (valid(body) && sendEmail(body)) {
    if (request.xhr) {
      response.setHeader('Content-Type', 'text/plain');
      response.end('Thank You!');
    } else {
      response.sendFile(__dirname + '/public/thanks.html');
    }
  } else {
    if (request.xhr) {
      response.status(400).send({ error: 'Invalid request.' });
    } else {
      response.sendFile(__dirname + '/public/error.html');
    }
  }
});

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
