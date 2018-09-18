'use strict';

const { QQ } = require('.');
const BotEngine = require('./BotEngine.js');
const be = new BotEngine(new QQ());
be.run();

be.on('roll', function(args) {
    if (!args) {
        this.reply(`${this.$msg.name}扔出了${rollD()}`);
        return;
    }
    // ndn+n comment
    let ndn = /^(?:(\d+)d(\d+))?(?:\+(\d+))?(?:\s*(.+))?/;
    if (ndn.test(args)) {
        let [, dice = 1, surface = 100, plus = 0, comment = ''] = args.match(ndn);
        if (dice <= 0 || dice > 10 || surface <= 0 || surface > 100 || plus > 100) {
            this.reply(`roll ({1-10}d{1-100})?(+{1-100})?(comment)?`);
            return;
        }
        let result = [],
            total = parseInt(plus),
            index = dice;
        while (index-- > 0) {
            let count = rollD(surface);
            result.push(count);
            total += count;
        }
        let message = [];
        message.push(`${this.$msg.name}扔`);
        if (comment) {
            message.push(`${comment}`);
        }
        message.push(`${dice}d${surface}`);
        if (plus > 0) {
            message.push(`+${plus}`);
        }
        message.push(`的结果是${result}`);
        if (result.length > 1 || plus > 0) {
            message.push(`,总计${total}.`);
        }
        this.reply(message.join(''));
    }
});

/**
 * 扔色子
 * @param {Number} surface
 */
function rollD(surface = 100) {
    let Range = surface - 1;
    let Rand = Math.random();
    let num = 1 + Math.round(Rand * Range); //四舍五入
    return num;
}
