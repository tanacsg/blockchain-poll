const express = require('express');
const mongo = require('mongodb');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const uuid = require('uuid/v1');
const rp = require('request-promise');
const cors = require("cors");
const PollBlockchain = require('../core/PollBlockchain')
const PollBlockchainService = require('../core/PollBlockchainService')

const { static } = require('express');


const MongoClient = mongo.MongoClient;
const url = "mongodb://root:example@localhost:27017/mydb?authSource=admin";

const corsOptions = {
	//origin: "http://localhost:8081"
	origin: "*"
  };
  
  

const app = express();

const PORT = process.env.port||'3000';

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

	const pollBlockchainService = app.locals.pollBlockchainService;

	const poll = new PollBlockchain.PollBlockchain(1, "Employee Survey", ["Very satisfied", "Not satisfied"])
	pollBlockchainService.createNewBlock(poll);

	poll.pendingVotes.push("Banan")
	poll.pendingVotes.push("Narancs")


	pollBlockchainService.createNewBlock(poll);


	dbo.collection("polls").insertOne(poll, function(err, result) {
		if (err) throw err;
        console.log("Inserted.");
		res.send('Inserted');
	 });	
});	

app.post('/vote', function(req, res) {
	const pollId = req.body.pollId;
	const votes = req.body.votes;
	const db = req.app.locals.db;
	const pollBlockchainService = app.locals.pollBlockchainService;

	const dbo = db.db("mydb");

	const query = { id: pollId };

	const newvalues = { $push: {pendingVotes: votes } };	

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

	app.locals.pollBlockchainService = new PollBlockchainService.PollBlockchainService();

	app.listen(PORT, function() {
		console.log(`Listening on port ${PORT}...`);
	});	

});	








