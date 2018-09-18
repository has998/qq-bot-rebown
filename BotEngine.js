'use strict';
var shell = require('shelljs');

class BotEngine {
    constructor(qq) {
        if (!qq) {
            return;
        }
        this.qq = qq;
        this.commands = {};
    }

    run() {
        console.info('[botEngine] Run...');
        this.qq.run();
        this.qq.on('qr', (qrcodePath) => {
            if (shell.which('imgcat')) {
                shell.exec(`imgcat ${qrcodePath}`);
            }
        });
        this.qq.on('login-success', () => {
            console.info('[botEngine] QQ login success.');
        });
        this.qq.on('msg', (msg) => this.commandAnalyzer(msg));
    }

    commandAnalyzer(msg) {
        let content = msg.content.trimRight();
        let regex = /^\.(.+?)(?:\W(.+))?$/;
        if (!regex.test(content)) {
            return;
        }

        let [, cmd, args] = content.match(regex);

        this.emmit(cmd, args, this.getBehavior(msg));
    }

    on(command, callback) {
        if (!this.commands[command]) {
            this.commands[command] = [];
        }
        if (Array.isArray(command)) {
            command.forEach((cmd) => this.commands[cmd].push(callback));
        } else {
            this.commands[command].push(callback);
        }
    }

    emmit(command, args, behavior = {}) {
        if (!this.commands[command]) {
            return;
        }
        this.commands[command].forEach(function(callback) {
            callback.call(behavior, args);
        });
    }

    getBehavior(msg) {
        let behavior = {
            $msg: msg,
        };
        switch (msg.type) {
            case 'buddy':
                behavior.reply = (content) => this.qq.sendBuddyMsg(msg.id, content);
                break;
            case 'group':
                behavior.reply = (content) => this.qq.sendGroupMsg(msg.groupId, content);
                break;
            case 'discu':
                behavior.reply = (content) => this.qq.sendDiscuMsg(msg.discuId, content);
                break;
            default:
                behavior.reply = () => {};
                break;
        }
        return behavior;
    }
}

module.exports = BotEngine;
