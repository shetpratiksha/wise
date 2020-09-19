var express = require('express');
var proxy = require('express-http-proxy');

var apiForwardingTestUrl = 'https://apitest.intentwise.com/';
var apiForwardingProdUrl = 'https://api.intentwise.com/';
app = express();

app.use(express.static(__dirname + '/dist'));
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/dist/index.html');
});


app.use('/api',proxy(apiForwardingProdUrl));
app.use('/apitest',proxy(apiForwardingTestUrl));


port = process.env.PORT || 8000
app.listen(port,function(){
    console.log('New Server started and listening on %s port', port);
});