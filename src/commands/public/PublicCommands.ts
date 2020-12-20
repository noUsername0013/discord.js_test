import { commandOptions } from '../../../botconfig.json';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';
import { Message, MessageAttachment, MessageEmbed } from 'discord.js';
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
export class HelpOverrideCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'help',
            memberName: 'help',
            group: 'public',
            description: 'Displays info of commands',
            args: [
                {
                    key: 'command',
                    type: 'string',
                    default: '',
                    prompt: 'What command do you want to view info for',
                },
            ],
        });
    }
    async run(msg: CommandoMessage, { command }) {
        const groups = this.client.registry.groups;
        const commands = this.client.registry.findCommands(command, false, msg);
        const embeds = [];
        if (command === '' || command === 'all') {
            groups.forEach((group) => {
                let embed = new MessageEmbed()
                    .setTitle(`${group.name}:`)
                    .setColor(0x00ffff);
                group.commands.forEach((cmd) => {
                    if (
                        cmd.isUsable((msg as unknown) as Message) &&
                        !cmd.hidden
                    )
                        embed.addField(cmd.name, cmd.description, true);
                });
                embeds.push(embed);
            });
            embeds.forEach((e) => msg.say(e));
            return (null as unknown) as Message;
        } else {
            if (commands.length > 2) {
                return msg.say(
                    'Multiple commands found. Please be more specific'
                );
            } else if (commands.length === 0) {
                return msg.say('Unable to identify command');
            } else {
                const cmd = commands[0];
                let desc = `**Format:** ${`${this.client.commandPrefix}${
                    cmd.name
                } ${cmd.format ? cmd.format : ''}`}\n**Group:** ${
                    cmd.group.name
                }`;
                if (cmd.examples)
                    desc += `\n**Examples:** ${cmd.examples.join(', ')}`;
                if (cmd.aliases[0])
                    desc += `\n**Aliases:** ${cmd.aliases.join(', ')}`;
                if (cmd.details) desc += `\n**Details:** ${cmd.details}`;
                let embed = new MessageEmbed()
                    .setTitle(`${cmd.name}: ${cmd.description}`)
                    .setDescription(desc);
                return msg.say(embed);
            }
        }
    }
}
