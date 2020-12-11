"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageCommand = exports.RandomIntCommand = exports.RandomCommand = exports.MyLevelCommand = exports.TestCommand = void 0;
const botconfig_json_1 = require("../../../botconfig.json");
const discord_js_commando_1 = require("discord.js-commando");
const discord_js_1 = require("discord.js");
const Database_1 = require("../../Database");
const aliases = botconfig_json_1.commandOptions.aliases;
class TestCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'test',
            memberName: 'test',
            group: 'public',
            description: 'Replys test',
            aliases: aliases.test,
        });
    }
    run(msg) {
        return msg.say('test');
    }
}
exports.TestCommand = TestCommand;
class MyLevelCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'mylevel',
            memberName: 'mylevel',
            group: 'public',
            description: 'Displays your level',
            aliases: aliases.mylevel,
        });
    }
    async run(msg) {
        return msg.say(`Your level is ${await (await Database_1.Users.findOne({ where: { id: msg.author.id } })).get('level')}`);
    }
}
exports.MyLevelCommand = MyLevelCommand;
class RandomCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'random',
            memberName: 'random',
            group: 'public',
            description: 'Generates a random number between the two arguments',
            examples: ['!random 0 100'],
            aliases: aliases.random,
            args: [
                {
                    key: 'firstInt',
                    default: '0',
                    prompt: '',
                    type: 'integer',
                    min: Number.MIN_SAFE_INTEGER,
                    max: Number.MAX_SAFE_INTEGER,
                },
                {
                    key: 'secondInt',
                    default: '100',
                    prompt: '',
                    type: 'integer',
                    min: Number.MIN_SAFE_INTEGER,
                    max: Number.MAX_SAFE_INTEGER,
                },
            ],
        });
    }
    run(msg, { firstInt, secondInt }) {
        return msg.say(Math.min(firstInt, secondInt) +
            Math.abs(firstInt - secondInt) * Math.random());
    }
}
exports.RandomCommand = RandomCommand;
class RandomIntCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'randomint',
            memberName: 'randomint',
            group: 'public',
            description: 'Generates a random integer between the two arguments',
            examples: ['!randomint 0 100'],
            aliases: aliases.randomint,
            args: [
                {
                    key: 'firstNum',
                    default: '0',
                    prompt: '',
                    type: 'float',
                    min: Number.MIN_SAFE_INTEGER,
                    max: Number.MAX_SAFE_INTEGER,
                },
                {
                    key: 'secondNum',
                    default: '100',
                    prompt: '',
                    type: 'float',
                    min: Number.MIN_SAFE_INTEGER,
                    max: Number.MAX_SAFE_INTEGER,
                },
            ],
        });
    }
    run(msg, { firstNum, secondNum }) {
        const max = Math.max(firstNum, secondNum);
        const min = Math.min(firstNum, secondNum);
        return msg.say(Math.floor(Math.random() * (max - min + 1)) + min);
    }
}
exports.RandomIntCommand = RandomIntCommand;
class ImageCommand extends discord_js_commando_1.Command {
    constructor(client) {
        super(client, {
            name: 'image',
            memberName: 'image',
            group: 'public',
            description: 'Sends an image with an URL',
            examples: ['!image https://via.placeholder.com/150.png'],
            aliases: aliases.image,
            args: [
                {
                    key: 'URL',
                    prompt: '',
                    type: 'string',
                    default: 'https://via.placeholder.com/150.png',
                    validate: (input) => {
                        //檢查網址
                        const pattern = new RegExp('^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$', 'i');
                        return pattern.test(input);
                    },
                },
            ],
        });
    }
    run(msg, { URL }) {
        return msg.channel.send(new discord_js_1.MessageAttachment(URL));
    }
}
exports.ImageCommand = ImageCommand;
