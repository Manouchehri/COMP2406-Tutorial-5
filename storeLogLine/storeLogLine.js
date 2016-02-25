// storeLogLine.js
//
// node storeLogLine.js <unquoted log message>
//
// Example:
//    node storeLogLine.js Feb 16 16:08:40 chimera systemd[1]: Started Session c3 of user soma.
//
// The log message should be of the format:
// <month> <day of month> <24-hour time in hh:mm:ss> <host> <service name[pid]>: Actual message
//

var mc = require('mongodb').MongoClient;

var entry = {};

entry.date = process.argv[2] + " " + process.argv[3];
entry.time = process.argv[4];
entry.host = process.argv[5];
entry.service = process.argv[6].slice(0,-1);  // drop the trailing colon
entry.message = process.argv.slice(7).join(' ');

var db;

var reportInserted = function(err, result) {
    if (err) {
	throw err;
    }

    console.log("Inserted the following log record:");
    console.log(result.ops[0]);
    db.close();
}

var connectCallback = function(err, returnedDB) {
    if (err) {
	throw err;
    }

    db = returnedDB;
    
    db.collection('logs').insert(entry, reportInserted);
}

mc.connect('mongodb://localhost/log-demo', connectCallback);
