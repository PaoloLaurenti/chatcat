'use strict'

const express = require('express');
const app = express();
const chatcat = require('./app');

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/', chatcat.router);

app.listen(app.get('port'), () => {
  console.log('Chatchat running on port:' + app.get('port'));
});
