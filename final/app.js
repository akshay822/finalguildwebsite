var express = require('express');
var app = express();

app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));
app.use('/util', express.static('util'));
app.use('/models', express.static('models'));
//app.use('/routes', express.static('routes'));

var specificConnection = require('./routes/specificConnection.js');
var profileController = require('./routes/profileController.js');
var forStaticPages = require('./routes/forStaticPages.js');

app.use('/connection', specificConnection);
app.use('/savedConnections', profileController);
app.use('', forStaticPages);
app.use('/', forStaticPages);

app.listen(3000, function(){
    console.log('listening on port 3000');
});
