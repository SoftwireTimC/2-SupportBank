
const log4js = require('log4js');
const logger = log4js.getLogger('account.js');

class account {
    constructor(name) {
        this.name = name;
        this.balance = 0;
        this.statement = [];
    }

    // apply a transaction to this account
    applyTransfer(t) {
        if(t.from == this.name){
            this.balance -= t.amount;
            this.statement.push([t.date.format("DD/MM/YYYY"), -1*t.amount, t.to, t.ref].join("   "));
        }else if(t.to == this.name){
            this.balance += t.amount;
            this.statement.push([t.date.format("DD/MM/YYYY"), t.amount, t.from, t.ref].join("   "));
        }else{
            // if transaction incorrectly submitted to this account
        }
    }
}

module.exports = account;