
// logger
const log4js = require('log4js');
const logger = log4js.getLogger('parserJSON.js');

// read in the JSON file
var { readFileSync } = require('fs');

var moment = require('moment');
var transfer = require('./transfer');

class parserJSON {
    getTransfers(file) {
        var data = readFileSync("./"+file);
        var transactions = JSON.parse(data);

        // make a list of all the transactions
        let transfers = [];
        transactions.forEach(function(t){
            if ( isNaN(t.Amount) ) {
                logger.error("transaction with invalid amount (" + t.Amount + ") - transaction ignored");
            } else if ( !moment(t.Date.slice(0,10), "YYYY-MM-DD").isValid() ) {
                logger.error("transaction with invalid date (" + t.Date + ") - transaction ignored");
            } else {
                transfers.push(new transfer(moment(t.Date.slice(0,10), "YYYY-MM-DD"), t.FromAccount, t.ToAccount, t.Narrative, +t.Amount));
            }
        });
        return transfers;
    }
}

module.exports = parserJSON;
