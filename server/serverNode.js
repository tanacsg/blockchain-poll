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

app.get('/insert', function(req, res) {

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		const dbo = db.db("mydb");
		const myobj = { businessId: '1', name: "Company Inc 3", address: "Highway 39" };

			dbo.collection("polls").insertOne(myobj, function(err2, result) {
				if (err2) throw err2;
				console.log("Inserted.");
				res.send('Inserted');
				db.close();
			  });	
		  });	
});

app.get('/query', function(req, res) {

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		const dbo = db.db("mydb");
		const query = { address: "Highway 39" };

			dbo.collection("polls").find(query).toArray(function(err2, result) {
				if (err2) throw err;
				console.log(result);
				db.close();
				res.send(result);
			  });	
		  });
});


app.use(express.static(staticRoot));

app.listen(port, function() {
	console.log(`Listening on port ${port}...`);
});





