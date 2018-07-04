
const log4js = require('log4js');
const logger = log4js.getLogger('transfer.js');

class transfer {
    constructor(date, from, to, ref, amount){
        this.date = date;
        this.from = from;
        this.to = to;
        this.ref = ref;
        this.amount = amount;
    }
}

module.exports = transfer;