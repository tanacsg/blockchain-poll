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

const corsOptions = {
	//origin: "http://localhost:8081"
	origin: "*"
  };



const app = express();

const DB_NAME = process.env.bc_db_name  ||  "mydb";
const DB_URL = "mongodb://root:example@localhost:27017/"+ DB_NAME + "?authSource=admin";


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
	const dbo = db.db(DB_NAME);

	const pollBlockchainService = app.locals.pollBlockchainService;

	const poll = new PollBlockchain.PollBlockchain("101", "Employee Survey", ["Very satisfied", "Not satisfied"])
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

app.post('/vote', async function (req, res) {
  const pollId = req.body.pollId;
  const votes = req.body.votes;
  const db = req.app.locals.db;
  const pollBlockchainService = app.locals.pollBlockchainService;

  const dbo = db.db(DB_NAME);

  const query = { id: pollId };

  const newvalues = { $push: { pendingVotes: votes } };

  try {
    const result = await dbo.collection("polls").updateOne(query, newvalues)
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }

  res.send({ 'status': 'Voted - Updated.' });

});

app.get('/initiateconsensus', function(req, res) {
	// const pollId = req.body.pollId;
	const db = req.app.locals.db;
	const pollBlockchainService = app.locals.pollBlockchainService;

	const dbo = db.db(DB_NAME);

	// const query = { id: pollId };

	const query = { id: req.query.id };



	dbo.collection("polls").find(query).toArray(function(err, pollBlockchainArray) {
		if (err) throw err;

		const pollBlockchain = pollBlockchainArray[0]
		pollBlockchainService.createNewBlock(pollBlockchain)

		dbo.collection("polls").replaceOne(query, pollBlockchain, function(err, pollBlockchainResult) {
			if (err) throw err;
			res.send(pollBlockchainResult.ops[0]);
		 });
	});


});

app.get('/query', function(req, res) {

	    const db = req.app.locals.db;
		const dbo = db.db(DB_NAME);

		dbo.collection("polls").find({}).toArray(function(err, result) {
			if (err) throw err;
			console.log(result);
			res.send(result);
		});
});

app.get('/poll/:id', function(req, res) {

	const db = req.app.locals.db;
	const dbo = db.db(DB_NAME);
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


app.post('/poll', async function (req, res) {
  const pollId = req.body.id;
  const pollName = req.body.name;
  const db = req.app.locals.db;
  const dbo = db.db(DB_NAME);

  const poll = new PollBlockchain.PollBlockchain(pollId, pollName, [])

  const query = { id: pollId };

  const pollBlockchainService = app.locals.pollBlockchainService;

  try {
    let result0 = await dbo.collection("polls").find(query)
    let polls = await result0.toArray()
    if (polls.length > 0) {
      res.status(400).send({ "message": "Id already in use: " + pollId, "id": pollId });
      return;
    }
    let result = await dbo.collection("polls").insertOne(poll)
    const m = 'PollBlockchain created with id: ' + pollId;
    console.log(m);

    res.status(201).send({ "message": m, "id": pollId });

  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }
});


app.use(express.static(staticRoot));

MongoClient.connect(DB_URL, function(err, db) {
	if (err) {
        console.log(`Failed to connect to the database. ${err.stack}`);
		throw err;
	}
	const dbo = db.db(DB_NAME);
	app.locals.db = db;

	app.locals.pollBlockchainService = new PollBlockchainService.PollBlockchainService();

	app.listen(PORT, function() {
		console.log(`Listening on port ${PORT}...`);
	});

});








