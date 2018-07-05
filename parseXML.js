
// logger
const log4js = require('log4js');
const logger = log4js.getLogger('parseXML.js');

// read in file
var { readFileSync } = require('fs');

var xmldoc = require('xmldoc');

var moment = require('moment');
require('moment-msdate');
var transfer = require('./transfer');

class parseXML {
    getTransfers(file) {
        var data = readFileSync("./"+file).toString('utf-8');
        var transactions = new xmldoc.XmlDocument(data);

        // make a list of all the transactions
        let transfers = [];
        transactions.childrenNamed("SupportTransaction").forEach(function(t){
            let amount = +t.valueWithPath("Value");
            let date = moment.fromOADate(t.attr.Date);
            if ( isNaN(amount) ) {
                logger.error("transaction with invalid amount (" + amount + ") - transaction ignored");
            } else if ( !date.isValid() ) {
                logger.error("transaction with invalid date (" + date + ") - transaction ignored");
            } else {
                transfers.push(new transfer(date, t.valueWithPath("Parties.From"), t.valueWithPath("Parties.To"), t.valueWithPath("Description"), amount));
            }
        });
        return transfers;
    }
}

module.exports = parseXML;
