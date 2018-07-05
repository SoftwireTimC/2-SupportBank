
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
var readline = require('readline-sync');

// custom classes
var account = require("./account");
var parserCSV = require("./parserCSV");
var parserJSON = require("./parserJSON");
var parserXML = require("./parseXML");

// setup parsers
let parCSV = new parserCSV();
let parJSON = new parserJSON();
let parXML = new parserXML();

// set up empty accounts and transfers variables
var accounts = new Map();
var transfers = [];

// accepts list of transactions
// returns list of accounts
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
        // checks for 'List' command - then lists appropriately
        // checks for 'Import' command - then imports appropriately
        // prints error if
        //      command is neither of above
        //      account not found
        //      file type not supported
        if (input.startsWith("List ")) {
            var x = input.substring(5);
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
            var file = input.split(' ').pop();
            var format = file.split('.').pop();
            switch (format) {
                case "csv":
                    transfers = parCSV.getTransfers(file);
                    break;
                case "json":
                    transfers = parJSON.getTransfers(file);
                    break;
                case "xml":
                    transfers = parXML.getTransfers(file);
                    break;
                default:
                    console.log("File format not supported");
                    format = "no";
                    break;
            }
            console.log(format + " file loaded");
            accounts = setupAccounts(transfers);
        } else {
            console.log("instruction not understood");
        }
    }
}
