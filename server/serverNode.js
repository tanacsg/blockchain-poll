const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const uuid = require('uuid/v1');
const rp = require('request-promise');
const { static } = require('express');

const app = express();

const port = process.argv[2];
const staticRoot = __dirname + '/dist/';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {

	console.log(__dirname)
	console.log(staticRoot)
	res.sendFile('./dist/index.html', { root: __dirname });
});

app.use(express.static(staticRoot));

app.listen(port, function() {
	console.log(`Listening on port ${port}...`);
});





