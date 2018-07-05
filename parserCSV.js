
// logger
const log4js = require('log4js');
const logger = log4js.getLogger('parserCSV.js');

// requirements
var { readFileSync } = require('fs');
var parse = require('csv-parse/lib/sync');
var moment = require('moment');
var transfer = require('./transfer');

class parserCSV {
    getTransfers(file) {
        // read in file
        var data = readFileSync("./"+file);
        var transactions = parse(data, {columns: true});

        // make a list of all the transfers from the data read from the file
        let transfers = [];
        transactions.forEach(function(t){
            let date = moment(t.Date, "DD/MM/YYYY");
            if ( isNaN(+t.Amount) ) {
                logger.error("transaction with invalid amount (" + t.Amount + ") - transaction ignored");
            } else if ( !date.isValid() ) {
                logger.error("transaction with invalid date (" + t.Date + ") - transaction ignored");
            } else {
                transfers.push(new transfer(date, t.From, t.To, t.Narrative, +t.Amount));
            }
        });
        return transfers;
    }
}

module.exports = parserCSV;