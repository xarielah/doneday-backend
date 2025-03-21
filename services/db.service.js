import { MongoClient } from 'mongodb';
import { config } from '../config';


export const dbService = {
    getCollection
}


// Connection URL
const url = config.dbURL;

// Database Name
const dbName = config.dbName
var dbConn = null


async function getCollection(collectionName) {
    const db = await _connect()
    return db.collection(collectionName)
}


async function _connect() {
    if (dbConn) return dbConn
    try {
        const client = await MongoClient.connect(url)
        const db = client.db(dbName)
        dbConn = db
        return db
    } catch (err) {
        console.log('Cannot Connect to DB', err)
        throw err
    }
}
