const express = require('express');
const mongo = require('mongodb');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const uuid = require('uuid/v1');
const rp = require('request-promise');
const cors = require("cors");
const BlockchainPoll = require('../core/BlockchainPoll.js')
const { static } = require('express');


const MongoClient = mongo.MongoClient;
const url = "mongodb://root:example@localhost:27017/mydb?authSource=admin";

const corsOptions = {
	//origin: "http://localhost:8081"
	origin: "*"
  };
  
  

const app = express();

const port = process.argv[2];
const staticRoot = __dirname + '/dist/blockchain-poll-frontend';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions));

app.get('/', function(req, res) {

	console.log(__dirname)
	console.log(staticRoot)
	res.sendFile('./dist/blockchain-poll-frontend/index.html', { root: __dirname });
});

app.get('/insert', function(req, res) {
	const db = req.app.locals.db;
	const dbo = db.db("mydb");
	let bp = new BlockchainPoll('21', 'First Poll', ['1','2']) 

	dbo.collection("polls").insertOne(bp, function(err, result) {
		if (err) throw err;
        console.log("Inserted.");
		res.send('Inserted');
	 });	
});	

app.post('/vote', function(req, res) {
	const pollId = req.body.pollId;
	const votes = req.body.votes;
	const db = req.app.locals.db;
	const dbo = db.db("mydb");

	const query = { id: pollId };

	const newvalues = { $push: {votes: votes } };


	dbo.collection("polls").updateOne(query, newvalues, function(err, result) {
		if (err) throw err;
        console.log("Voted - Updated.");
		res.send({'status': 'Voted - Updated.'});
	 });	
});	

app.get('/query', function(req, res) {

	    const db = req.app.locals.db;	
		const dbo = db.db("mydb");

		dbo.collection("polls").find({}).toArray(function(err, result) {
			if (err) throw err;
			console.log(result);
			res.send(result);
		});		 
});

app.get('/poll/:id', function(req, res) {

	const db = req.app.locals.db;	
	const dbo = db.db("mydb");
	const query = { id: req.params.id };

	dbo.collection("polls").find(query).toArray(function(err, result) {
		if (err) throw err;
		console.log(result);
		if (result.length && result.length > 0) {
			res.send(result[0]);	
		} else {
			res.send(null);
		}		
	});		 
});



app.use(express.static(staticRoot));

MongoClient.connect(url, function(err, db) {
	if (err) {
        console.log(`Failed to connect to the database. ${err.stack}`);
		throw err;
	}
	const dbo = db.db("mydb");
	app.locals.db = db;
	app.listen(port, function() {
		console.log(`Listening on port ${port}...`);
	});	

});	








