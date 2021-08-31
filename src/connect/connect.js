const { MongoClient } = require("mongodb");
const dotenv = require('dotenv');
dotenv.config();
console.log(process.env.REACT_APP_MONGO_DB_PW);
 
// Replace the following with your Atlas connection string                                                                                                                                        
const url = `mongodb+srv://bpapin19:${process.env.REACT_APP_MONGO_DB_PW}@spots.it5t3.mongodb.net/SpotTracker?retryWrites=true&w=majority`;
const client = new MongoClient(url);
async function run() {
    try {
        await client.connect();
        console.log("Connected correctly to server");
    } catch (err) {
        console.log(err.stack);
    }
    finally {
        await client.close();
    }
}
run().catch(console.dir);
