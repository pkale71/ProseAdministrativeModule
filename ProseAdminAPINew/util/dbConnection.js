const mysql2 = require('mysql2');
const commonFunction = require('./commonFunctions');

let obj = {
    host: "localhost",
    port: "3306",
    user: "root",
    password: "admin",    
    database: commonFunction.databaseName()
}
const pool = mysql2.createPool(obj);
pool.on('error', (err) => 
{
    console.error('Pool error:', err);
    handleDisconnect();
});

function handleDisconnect() {
    console.log('Reconnecting to the database...');
    pool = mysql2.createPool(obj);
}

module.exports = pool