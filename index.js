
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
var readline = require('readline-sync');

// custom classes
var account = require("./account");
var transfer = require("./transfer");
var parserCSV = require("./parserCSV");
var parserJSON = require("./parserJSON");

// setup parsers
let parCSV = new parserCSV();
let parJSON = new parserJSON();

// set up accounts and transfers
var accounts = new Map();
var transfers = [];

// returns list of accounts calculated from a list of transfers
function setupAccounts (transfers) {
    let a = new Map();
    // apply transfers to accounts (making new accounts in the process)
    transfers.forEach(function(t) {
        if (!a[t.from]) {
            a[t.from] = new account(t.from);
        }
        if (!a[t.to]) {
            a[t.to] = new account(t.to);
        }
        a[t.from].applyTransfer(t);
        a[t.to].applyTransfer(t);
    })
    return a;
}


// main
while(true) {
    var input = readline.question("Enter command: ");
    if (input == "Exit") {
        break;
    }
    if (input !== null) {
        if (input.startsWith("List ")) {
            var x = input.substring("List ".length);
            if (x == "All") {
                if (accounts !== {}) {
                    for (let name in accounts) {
                        console.log(name + "   " + accounts[name].balance.toFixed(2));
                    }
                } else {
                    console.log("No accounts found");
                }
            } else if (!accounts[x]) {
                console.log("Error: account does not exist");
            } else {
                console.log(accounts[x].statement.join("\n"));
            }
        } else if (input.startsWith("Import ")) {
            var file = input.split(' ')[1];
            // var filename = file.split('.')[0];
            var fileformat = file.split('.')[1];
            switch (fileformat) {
                case "csv":
                    transfers = parCSV.getTransfers(file);
                    console.log("csv file loaded");
                    break;
                case "json":
                    transfers = parJSON.getTransfers(file);
                    console.log("json file loaded");
                    break;
                case "xml":
                    console.log("xml file loaded");
                    break;
                default:
                    console.log("File format not supported");
            }
            accounts = setupAccounts(transfers);
        } else {
            logger.error("Cheeeeese");
            console.log("instruction not understood");
        }
    }
}

