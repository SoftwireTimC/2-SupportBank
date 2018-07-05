
// logger
const log4js = require('log4js');
const logger = log4js.getLogger('parserJSON.js');

// requirements
var { readFileSync } = require('fs');
var moment = require('moment');
var transfer = require('./transfer');

class parserJSON {
    getTransfers(file) {
        // read in file
        var data = readFileSync("./"+file);
        var transactions = JSON.parse(data);

        // make a list of all the transfers from the data read from the file
        let transfers = [];
        transactions.forEach(function(t){
            let date = moment(t.Date.slice(0,10), "YYYY-MM-DD");
            if ( isNaN(t.Amount) ) {
                logger.error("transaction with invalid amount (" + t.Amount + ") - transaction ignored");
            } else if ( !date.isValid() ) {
                logger.error("transaction with invalid date (" + t.Date + ") - transaction ignored");
            } else {
                transfers.push(new transfer(date, t.FromAccount, t.ToAccount, t.Narrative, +t.Amount));
            }
        });
        return transfers;
    }
}

module.exports = parserJSON;
