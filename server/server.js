const express = require('express');
const mongo = require('mongodb');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid/v1');
const rp = require('request-promise');
const cors = require("cors");
const PollBlockchain = require('../core/PollBlockchain')
const PollBlockchainService = require('../core/PollBlockchainService')
const log = require('simple-node-logger').createSimpleLogger('blockchain-poll.log');
const serveIndex = require('serve-index')


const { static, response } = require('express');


const MongoClient = mongo.MongoClient;

const corsOptions = {
	//origin: "http://localhost:8081"
	origin: "*"
  };



const app = express();

const DB_NAME = process.env.BCP_DB_NAME  ||  "mydb";
const DB_URL = process.env.BCP_DB_URL || "mongodb://root:example@localhost:27017/"+ DB_NAME + "?authSource=admin";
const COLLECTION_NAME = process.env.BCP_DB_COLLECTION_NAME  ||  "polls";


const PORT = process.env.port||'3000';

const staticRoot = __dirname + '/dist/blockchain-poll-frontend';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(express.static(staticRoot));

//server everything from the folder, to make it fully open source
const parentDir = path.join(__dirname, '../')
app.use('/sources', express.static(parentDir ), serveIndex(parentDir, {'icons': true} ));

app.get('/', function(req, res) {

	log.info(__dirname)
	log.info(staticRoot)
	res.sendFile('./dist/blockchain-poll-frontend/index.html', { root: __dirname });
});



app.post('/api/vote', async function (req, res) {
  const pollId = req.body.pollId;
  const votes = req.body.votes;
  let ballotCode = req.body.ballotCode;
  if (!ballotCode || !pollId || !votes ) {
    res.status(400).json({"message": "Required parameters are missing."})
    return
  }
  ballotCode = ballotCode.trim()

  const db = req.app.locals.db;
  const pollBlockchainService = app.locals.pollBlockchainService;

  const vote = pollBlockchainService.vote2(ballotCode, votes )

  const dbo = db.db(DB_NAME);

  let contains = await containsBallotCodeHashCode(pollId, vote.usedBallotCodeHashCodes)
  log.info("containsBallotCodeHashCode: " + contains)
  if (!contains) {
    res.status(400).json({"message": "BallotCode is not registered."})
    return
  }

  let contains2 = await containsUsedBallotCodeHashCode(pollId, vote.usedBallotCodeHashCodes)
  log.info("containsUsedBallotCodeHashCode: "+contains2)
  if (contains2) {
    res.status(400).json({"message": "BallotCode has already been used once."})
    return
  }

  const query = { id: pollId };

  const newvalues = {
    $push: {
      "pendingData.usedBallotCodeHashCodes": vote.usedBallotCodeHashCodes,
      "pendingData.votes": vote.votes
    }
  };

  try {
    const result = await dbo.collection(COLLECTION_NAME).updateOne(query, newvalues)
  } catch (error) {
    log.error(error)
    res.status(500).send(error)
  }

  res.send({ 'message': 'Vote accepted.' , 'receipt' : votes[votes.length-1] });

});


app.post('/api/register', async function (req, res) {
  const pollId = req.body.pollId;
  let username = req.body.username;

  if (!username || !pollId) {
    res.status(400).json({ "message": "Required parameters are missing." })
    return
  }
  username = username.trim().toLowerCase();

  const db = req.app.locals.db;
  const pollBlockchainService = app.locals.pollBlockchainService;

  const registerReceipt = pollBlockchainService.registerUser2(username)

  let usernameHashRegistered = await containsRegisteredUserHashCode(pollId, registerReceipt.pendingRegisteredUserHashCodes)
  log.info("usernameHashRegistered: " + usernameHashRegistered)
  if (usernameHashRegistered) {
    res.status(400).json({ "message": "Username has already been registered." })
    return
  }

  const dbo = db.db(DB_NAME);

  const query = { id: pollId };

  const newvalues = {
    $push: {
      "pendingData.registeredUserHashCodes": registerReceipt.pendingRegisteredUserHashCodes,
      "pendingData.ballotCodeHashCodes": registerReceipt.pendingBallotCodeHashCodes
    }
  };

  try {
    const result = await dbo.collection(COLLECTION_NAME).updateOne(query, newvalues)
  } catch (error) {
    log.error(error)
    res.status(500).send(error)
  }

  res.send({ 'ballotCode': registerReceipt.ballotCode });

});


app.get('/api/createblock', async function (req, res) {
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
    let pollBlockchainResp = await dbo.collection(COLLECTION_NAME).findOneAndUpdate(query, cleanPendingData, { returnNewDocument: false })

    let pollBlock = pollBlockchainService.createNewBlock2(pollBlockchainResp.value)

    const newPollBlock = {
      $push: {
        "chain": pollBlock
      }
    }

    await dbo.collection(COLLECTION_NAME).updateOne(query, newPollBlock)

    session.commitTransaction();

    res.status(200).json({ "message": "Block created with index: " + pollBlock.index })


  } catch (error) {
    session.abortTransaction()
    log.info(error)
    res.status(500).send(error)
  }

});

app.get('/api/query', function(req, res) {

	    const db = req.app.locals.db;
		const dbo = db.db(DB_NAME);

		dbo.collection(COLLECTION_NAME).find({}).toArray(function(err, result) {
			if (err) throw err;
			log.info(result);
			res.send(result);
		});
});

app.get('/api/poll/:id', function(req, res) {

	const db = req.app.locals.db;
	const dbo = db.db(DB_NAME);
	const query = { id: req.params.id };

	dbo.collection(COLLECTION_NAME).find(query).toArray(function(err, result) {
		if (err) throw err;
		log.info(result);
		if (result.length && result.length > 0) {
			res.send(result[0]);
		} else {
			res.send(null);
		}
	});
});

async function containsUsedBallotCodeHashCode(pollId, usedBallotCodeHashCode ) {
	const db = app.locals.db;
	const dbo = db.db(DB_NAME);
  const query = { id: pollId };

  let result = await dbo.collection(COLLECTION_NAME).find(query).project({ _id: 0, 'pendingData.usedBallotCodeHashCodes': 1, 'chain.data.usedBallotCodeHashCodes': 1}).toArray()

  let resutString = JSON.stringify( result)
  log.info("usedBallotCodeHashCodes: " + resutString);
  return resutString.includes(usedBallotCodeHashCode)

}

async function containsRegisteredUserHashCode(pollId, registeredUserHashCode ) {
	const db = app.locals.db;
	const dbo = db.db(DB_NAME);
  const query = { id: pollId };

  let result = await dbo.collection(COLLECTION_NAME).find(query).project({ _id: 0, 'pendingData.registeredUserHashCodes': 1, 'chain.data.registeredUserHashCodes': 1}).toArray()

  let resutString = JSON.stringify( result)
  log.info("registeredUserHashCodes: " + resutString);
  return resutString.includes(registeredUserHashCode)

}

async function containsBallotCodeHashCode(pollId, ballotCodeHashCodes ) {
	const db = app.locals.db;
	const dbo = db.db(DB_NAME);
  const query = { id: pollId };

  let result = await dbo.collection(COLLECTION_NAME).find(query).project({ _id: 0, 'pendingData.ballotCodeHashCodes': 1, 'chain.data.ballotCodeHashCodes': 1}).toArray()

  let resutString = JSON.stringify( result)
  log.info("ballotCodeHashCodes: " + resutString);
  return resutString.includes(ballotCodeHashCodes)

}

app.post('/api/poll', async function (req, res) {
  const pollId = req.body.id;
  const pollName = req.body.name;
  const db = req.app.locals.db;
  const dbo = db.db(DB_NAME);

  const poll = req.body

  const query = { id: pollId };


  try {
    let result0 = await dbo.collection(COLLECTION_NAME).find(query)
    let polls = await result0.toArray()
    if (polls.length > 0) {
      res.status(400).send({ "message": "Id already in use: " + pollId, "id": pollId });
      return;
    }
    let result = await dbo.collection(COLLECTION_NAME).insertOne(poll)
    const m = 'PollBlockchain created with id: ' + pollId;
    log.info(m);

    res.status(201).send({ "message": m, "id": pollId });

  } catch (error) {
    log.error(error)
    res.status(500).send(error)
  }
});

app.delete('/api/poll/:id', async function (req, res) {

  const db = req.app.locals.db;
  const dbo = db.db(DB_NAME);
  const query = { id: req.params.id };

  try {
    await dbo.collection(COLLECTION_NAME).remove(query, { justOne: true })
    response.status(202)
  } catch (error) {
    log.error(error)
    res.status(500).send(error)
  }
});


MongoClient.connect(DB_URL, function(err, db) {
	if (err) {
        log.info(`Failed to connect to the database. ${err.stack}`);
		throw err;
	}
	const dbo = db.db(DB_NAME);
	app.locals.db = db;

	app.locals.pollBlockchainService = new PollBlockchainService.PollBlockchainService();

	app.listen(PORT, function() {
		log.info(`Listening on port ${PORT}...`);
	});

});








