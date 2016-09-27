var express = require('express');
var path = require("path");
var app = express();

app.use(express.static(path.join(__dirname, 'static/html')));
app.use(express.static(path.join(__dirname, 'static/css')));
app.use(express.static(path.join(__dirname, 'static/js')));

app.listen(process.env.PORT || 8000);
