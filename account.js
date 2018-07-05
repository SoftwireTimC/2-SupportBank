
const log4js = require('log4js');
const logger = log4js.getLogger('account.js');

class account {
    // account initialised with 0 balance and an empty statement
    constructor(name) {
        this.name = name;
        this.balance = 0;
        this.statement = [];
    }

    // apply a transaction to account
    //      update balance
    //      add item to statement
    applyTransfer(t) {
        let date = t.date.format("DD/MM/YYYY");
        let amount = (this.name == t.to) ? t.amount:-t.amount;
        this.balance += amount;
        this.statement.push([date, amount, t.from, t.ref].join("   "));
    }
}

module.exports = account;