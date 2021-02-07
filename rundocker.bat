docker run -p 8080:3000 --link server_mongo_1 --net server_default -e BCP_DB_URL=mongodb://root:example@mongo:27017/mydb?authSource=admin -it tanacsg/blockchain-poll
