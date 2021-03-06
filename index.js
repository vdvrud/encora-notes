import { app } from "./src/app";
import { mongooseConnection } from "./src/config/db";
import fs from 'fs';
import { folders } from "./src/commons/image";

const PORT = process.env.port || 5000;

const start = async() => {
    // Check to see if all the env variables exist
    const { DB_USER_NAME, DB_PASS, JWT_EXPIRY, JWT_SECRET } = process.env;
    if(!DB_PASS || !DB_USER_NAME || !JWT_SECRET || !JWT_EXPIRY) {
        console.log('Error in connecting to server, please try again!');
    }
    // Mongo Db Connection Initiation
    await mongooseConnection();
    app.listen(5000, () => {
        console.log(`Server started on ${PORT}`);
        // Creating static folders recursively when server starts.
        folders.forEach(folder => {
            fs.mkdirSync(`${__dirname}${folder}`, {
                recursive: true
              })
        });
    })
}


start();