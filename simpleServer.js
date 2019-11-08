var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jwt = require('jsonwebtoken');
require('dotenv').config();
var cors = require('cors')

app.use(cors())

http.listen(8080, function() {
   console.log('listening on *:8080');
});

io.on('connection', function(socket) {
   console.log('Connected');

   socket.on('disconnect', function () {
      console.log('Disconnected');
   });
});

app.get('/', function(req, res) {
   res.sendfile('index.html'); 
});

//Can be a post requiest if needed
app.get('/auth', function(req, res) {
    //Set variables
    const sessionServer = process.env.SESSION_SERVER;
    const sessionServerKeyName = process.env.SESSION_SERVER_KEY_NAME;
    const sessionServerKeyValue = process.env.SESSION_SERVER_KEY_VALUE;
    //Set expiration
    const issuedAt = Math.floor((new Date()).getTime() / 1000);
    const expiresAt = issuedAt + (60 * 60);

    // Sign JWT with Secret
    const token = jwt.sign({
      'sessionId': '',
      'sm-control': sessionServer,
      'nbf': issuedAt,
      'exp': expiresAt,
      'iat': issuedAt,
      'iss': sessionServerKeyName,
    }, sessionServerKeyValue); 

    // Verify JWT ** FOR TESTING **
    jwt.verify(token, sessionServerKeyValue, function (err, payload) {
      if (err) {
          return console.log('ERROR: ', err);
      }
      console.log('JWT is valid and payload is\n', payload);
    });

    //Reply with response 
    res.json(token);
});