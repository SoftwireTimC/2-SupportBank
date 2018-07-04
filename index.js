
// logger
const log4js = require('log4js');
log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});
const logger = log4js.getLogger('index.js');

// dependencies
var moment = require('moment');

// custom classes
var account = require("./account");
var transfer = require("./transfer");
var parserCSV = require("./parserCSV");
var parserJSON = require("./parserJSON");

// setup parsers
let parCSV = new parserCSV();
let parJSON = new parserJSON();

// set up accounts
var accounts = new Map();


function setupAccounts (transfers) {
    let accounts = new Map();
    // apply transfers to accounts (making new accounts in the process)
    transfers.forEach(function(t) {
        if (!accounts[t.from]) {
            accounts[t.from] = new account(t.from);
        }
        if (!accounts[t.to]) {
            accounts[t.to] = new account(t.to);
        }
        accounts[t.from].applyTransfer(t);
        accounts[t.to].applyTransfer(t);
    })
    return accounts;
}


// main
process.stdin.on('readable', () => {
    const input = process.stdin.read().toString("utf-8").slice(0,-1);
    if (input !== null) {
        if ( input.startsWith("List ") ) {
            var x = input.substring("List ".length);
            if (x == "All") {
                for (let name in accounts) {
                    console.log(name + "   " + accounts[name].balance.toFixed(2));
                }
            } else if (!accounts[x]) {
                console.log("Error: account does not exist");
            } else {
                console.log(accounts[x].statement.join("\n"));
            }
        } else if ( input.startsWith("Import ") ) {
            var file = input.split(" ")[1];
            filename = file.split(".")[0];
            fileformat = file.split(".")[1];
            console.log(file);
            switch (fileformat) {
                case "csv":
                    var transfers = parCSV.getTransfers(file);
                    break;
                case "json":
                    var transfers = parJSON.getTransfers(file);
                    break;
                case "xml":
                    break;
                default:
                    console.log("File format not supported");
            }
        } else {
            logger.error("Cheeeeese");
            console.log("instruction not understood");
        }
    }
});

