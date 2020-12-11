import * as Discord from 'discord.js';
import * as fs from 'fs';
import { commandOptions } from '../botconfig.json';
import { CommandoClient } from 'discord.js-commando';
import { join } from 'path';
import * as events from 'events';
import { Users } from './Database';
const client = new CommandoClient({
    commandPrefix: commandOptions.prefix,
    owner: '488709903737815040',
});
client.registry
    .registerDefaultTypes()
    .registerGroups([
        ['admin', 'Admin only commands'],
        ['public', 'Public commands'],
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(join(__dirname, 'commands/public'))
    .registerCommandsIn(join(__dirname, 'commands/admin'));
export { client };
if (!fs.existsSync('./users/users.json')) {
    console.log('users.json does not exist, creating one');
    if (!fs.existsSync('./users')) {
        fs.mkdirSync('./users');
    }
    fs.writeFileSync('./users/users.json', '{}', { encoding: 'utf-8' });
}
async function handleExp(msg: Discord.Message): Promise<void> {
    //喵喵經驗值?
    const author = msg.author.id;
    let user = await Users.findOne({ where: { id: author } });
    if (!user) {
        await Users.create({ id: author, level: 0, exp: 0 });
        user = await Users.findOne({ where: { id: author } });
    }
    const dataValue = {
        id: user.get('id'),
        level: user.get('level') as number,
        exp: user.get('exp') as number,
    };
    console.log(dataValue);
    console.log(user);

    const exp = msg.content.length * 0.2;
    const lvlReq = Math.floor(100 * Math.pow(1.01, dataValue.level));

    dataValue.exp += exp;
    if (dataValue.exp > lvlReq) {
        dataValue.exp -= lvlReq;
        dataValue.level++;
    }
    dataValue.exp = Math.ceil(dataValue.exp * 10) / 10;
    user.update(dataValue);
}

function onMessage(msg: Discord.Message): void {
    //處理訊息
    handleExp(msg);
}
function welcome(member: Discord.GuildMember): void {
    //歡迎新成員
    let ch: Discord.Channel;
    try {
        ch = member.guild.channels.cache.find(
            (ch) => ch.id === '775699083108024333'
        );
    } catch (err) {
        console.error(err);
    }
    if (ch instanceof Discord.TextChannel) {
        ch.send(`Welcome <@${member.id}>!`);
        const attachment = new Discord.MessageAttachment(
            member.user.avatarURL()
        );
        console.log(attachment);
        ch.send(attachment);
    }

    const role = member.guild.roles.cache.find(
        (role) => role.id === '775700051849904149'
    );
    member.guild.roles.add(role);
    console.log(`member ${member.user.username} joined`);
}

client.login(fs.readFileSync('./.token.txt', 'utf-8'));
client.once('ready', () => {
    console.log('ready', client.user.tag);
});
client.on('message', (msg) => onMessage(msg));

client.on('guildMemberAdd', (member) => welcome(member));

const emitter = new events.EventEmitter();
function timer() {
    setTimeout(() => {
        emitter.emit('event1');
        console.log('checking mutes...');
        const mutes = JSON.parse(
            fs.readFileSync('./users/mutes.json', 'utf-8')
        );
        const currentTime = Date.now();
        for (const key in mutes) {
            const expireTime = mutes[key].expireDate;
            if (expireTime < currentTime) {
                delete mutes[key];
                console.log('deleted mute of ' + key);
                client.channels
                    .fetch('781162983274971186')
                    .then((ch) =>
                        (ch as any).send(`<@${key}>'s mute has expired`)
                    );
                client.guilds
                    .fetch('775699083108024331')
                    .then((g) =>
                        g.members
                            .fetch(key)
                            .then((m) => m.roles.remove('785839177022963731'))
                    );
            }
        }
        fs.writeFileSync('./users/mutes.json', JSON.stringify(mutes));
    }, 60000);
}
emitter.on('event1', timer);
emitter.emit('event1');
