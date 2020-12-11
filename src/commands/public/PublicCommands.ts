import { commandOptions } from '../../../botconfig.json';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { MessageAttachment } from 'discord.js';
import { Users } from '../../Database';
const aliases = commandOptions.aliases;

export class TestCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'test',
            memberName: 'test',
            group: 'public',
            description: 'Replys test',
            aliases: aliases.test,
        });
    }
    run(msg: CommandoMessage) {
        return msg.say('test');
    }
}
export class MyLevelCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'mylevel',
            memberName: 'mylevel',
            group: 'public',
            description: 'Displays your level',
            aliases: aliases.mylevel,
        });
    }
    async run(msg: CommandoMessage) {
        return msg.say(
            `Your level is ${await (
                await Users.findOne({ where: { id: msg.author.id } })
            ).get('level')}`
        );
    }
}
export class RandomCommand extends Command {
    constructor(client: CommandoClient) {
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
    run(msg: CommandoMessage, { firstInt, secondInt }) {
        return msg.say(
            Math.min(firstInt, secondInt) +
                Math.abs(firstInt - secondInt) * Math.random()
        );
    }
}
export class RandomIntCommand extends Command {
    constructor(client: CommandoClient) {
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
    run(msg: CommandoMessage, { firstNum, secondNum }) {
        const max = Math.max(firstNum, secondNum);
        const min = Math.min(firstNum, secondNum);
        return msg.say(Math.floor(Math.random() * (max - min + 1)) + min);
    }
}
export class ImageCommand extends Command {
    constructor(client: CommandoClient) {
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
                    validate: (input: string) => {
                        //檢查網址
                        const pattern = new RegExp(
                            '^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$',
                            'i'
                        );
                        return pattern.test(input);
                    },
                },
            ],
        });
    }
    run(msg: CommandoMessage, { URL }) {
        return msg.channel.send(new MessageAttachment(URL));
    }
}
