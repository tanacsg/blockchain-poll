const express = require('express');
const mongo = require('mongodb');
const path = require('path');
const fs = require('fs');
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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

app.get('/', function(req, res) {

	console.log(__dirname)
	console.log(staticRoot)
	res.sendFile('./dist/blockchain-poll-frontend/index.html', { root: __dirname });
});



app.post('/vote', async function (req, res) {
  const pollId = req.body.pollId;
  const votes = req.body.votes;
  const ballotCode = req.body.ballotCode;

  const db = req.app.locals.db;
  const pollBlockchainService = app.locals.pollBlockchainService;

  const vote = pollBlockchainService.vote2(ballotCode, votes )

  const dbo = db.db(DB_NAME);

  const query = { id: pollId };

  const newvalues = {
    $push: {
      "pendingData.usedBallotCodeHashCodes": vote.usedBallotCodeHashCodes,
      "pendingData.votes": vote.votes
    }
  };

  try {
    const result = await dbo.collection("polls").updateOne(query, newvalues)
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }

  res.send({ 'message': 'Vote accepted.' });

});


app.post('/register', async function (req, res) {
  const pollId = req.body.pollId;
  const username = req.body.username;

  const db = req.app.locals.db;
  const pollBlockchainService = app.locals.pollBlockchainService;

  const registerReceipt = pollBlockchainService.registerUser2(username)

  const dbo = db.db(DB_NAME);

  const query = { id: pollId };

  const newvalues = {
    $push: {
      "pendingData.registeredUserHashCodes": registerReceipt.pendingRegisteredUserHashCodes,
      "pendingData.ballotCodeHashCodes": registerReceipt.pendingBallotCodeHashCodes
    }
  };

  try {
    const result = await dbo.collection("polls").updateOne(query, newvalues)
  } catch (error) {
    console.log(error)
    res.status(500).send(error)
  }

  res.send({ 'ballotCode': registerReceipt.ballotCode });

});


app.get('/createblock', async function (req, res) {
  const db = req.app.locals.db;
  const pollBlockchainService = app.locals.pollBlockchainService;

  const dbo = db.db(DB_NAME);

  const query = { id: req.query.id };


  let session
  try {

    const cleanPendingData = {
      $set: {
        "pendingData": new PollBlockchain.PollData([], [], [], [])
      }
    }

    session = db.startSession()
    session.startTransaction( { readConcern: { level: "snapshot" }, writeConcern: { w: "majority" } } );

    //TODO make it transactional
    let pollBlockchainResp = await dbo.collection("polls").findOneAndUpdate(query, cleanPendingData, { returnNewDocument: false })

    let pollBlock = pollBlockchainService.createNewBlock2(pollBlockchainResp.value)

    const newPollBlock = {
      $push: {
        "chain": pollBlock
      }
    }

    await dbo.collection("polls").updateOne(query, newPollBlock)

    session.commitTransaction();

    res.status(200).json({ "message": "Block created with index: " + pollBlock.index })


  } catch (error) {
    session.abortTransaction()
    console.log(error)
    res.status(500).send(error)
  }

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

  const poll = req.body

  const query = { id: pollId };


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








