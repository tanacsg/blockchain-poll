# blockchain-poll

## Introduction

A simple web application to use blockchain for polling/voting using the MEAN stack (MongoDB, Express.js, Node.js, Angular).

Its is designed as an educational application which explains the use case how to use blockchain for voting, but it can  be used for polls where the transparecy of the voting is important, and where the audience has affinity and curiosity to vote with blockchain.

**Under construction!**

## Components

- **client:** the Angular frotnend application (a stadard Angular project)
- **core:** the common Blockchain-related domain classes and service
- **server:** the Node.js, Express.js server (backend) application


## Build

Assumption: Node.js 14 is installed and in the subprojects `npm install` has been executed. 

`build_client.bat` - builds the Angular frontend


`build_docker.bat` - builds the Docker image 

## Run

`run_docker.bat`

The command starts docker containers of MongoDB, a Mongo Express and the Blockchain-Poll application.  

## Docker Image

Ready prepared Docker images are avaiable:

`docker pull tanacsg/blockchain-poll`
