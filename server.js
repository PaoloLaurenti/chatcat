'use strict'

const express = require('express');
const app = express();

app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res, next) => {
  res.render('login', {
    pageTitle: 'My Login Page'
  });
});

app.listen(app.get('port'), () => {
  console.log('Chatchat running on port:' + app.get('port'));
});
