const express = require('express');
const mongo = require('mongodb');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const uuid = require('uuid/v1');
const rp = require('request-promise');
const { static } = require('express');

const MongoClient = mongo.MongoClient;
const url = "mongodb://root:example@localhost:27017/mydb?authSource=admin";

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

app.get('/mongodb', function(req, res) {

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		const dbo = db.db("mydb");
			dbo.createCollection("polls", function(err, res) {
				if (err) throw err;
				console.log("Collection created!");
				db.close();
			  });	
		  });

	res.send('Mongo DB');
});


app.use(express.static(staticRoot));

app.listen(port, function() {
	console.log(`Listening on port ${port}...`);
});





