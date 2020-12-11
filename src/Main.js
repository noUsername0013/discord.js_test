"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const Discord = require("discord.js");
const fs = require("fs");
const botconfig_json_1 = require("../botconfig.json");
const discord_js_commando_1 = require("discord.js-commando");
const path_1 = require("path");
const Database_1 = require("./Database");
const client = new discord_js_commando_1.CommandoClient({
    commandPrefix: botconfig_json_1.commandOptions.prefix,
    owner: '488709903737815040',
});
exports.client = client;
client.registry
    .registerDefaultTypes()
    .registerGroups([
    ['admin', 'Admin only commands'],
    ['public', 'Public commands'],
])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path_1.join(__dirname, 'commands/public'))
    .registerCommandsIn(path_1.join(__dirname, 'commands/admin'));
if (!fs.existsSync('./users/users.json')) {
    console.log('users.json does not exist, creating one');
    if (!fs.existsSync('./users')) {
        fs.mkdirSync('./users');
    }
    fs.writeFileSync('./users/users.json', '{}', { encoding: 'utf-8' });
}
async function handleExp(msg) {
    //喵喵經驗值?
    const author = msg.author.id;
    let user = await Database_1.Users.findOne({ where: { id: author } });
    if (!user) {
        await Database_1.Users.create({ id: author, level: 0, exp: 0 });
        user = await Database_1.Users.findOne({ where: { id: author } });
    }
    const dataValue = {
        id: user.get('id'),
        level: user.get('level'),
        exp: user.get('exp'),
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
function onMessage(msg) {
    //處理訊息
    handleExp(msg);
}
function welcome(member) {
    //歡迎新成員
    let ch;
    try {
        ch = member.guild.channels.cache.find((ch) => ch.id === '775699083108024333');
    }
    catch (err) {
        console.error(err);
    }
    if (ch instanceof Discord.TextChannel) {
        ch.send(`Welcome <@${member.id}>!`);
        const attachment = new Discord.MessageAttachment(member.user.avatarURL());
        console.log(attachment);
        ch.send(attachment);
    }
    const role = member.guild.roles.cache.find((role) => role.id === '775700051849904149');
    member.guild.roles.add(role);
    console.log(`member ${member.user.username} joined`);
}
client.login(fs.readFileSync('./.token.txt', 'utf-8'));
client.once('ready', () => {
    console.log('ready', client.user.tag);
});
client.on('message', (msg) => onMessage(msg));
client.on('guildMemberAdd', (member) => welcome(member));
// const emitter = new events.EventEmitter();
// function timer() {
//     setTimeout(() => {
//         emitter.emit('event1');
//         console.log('checking mutes...');
//         const mutes = JSON.parse(
//             fs.readFileSync('./users/mutes.json', 'utf-8')
//         );
//         const currentTime = Date.now();
//         for (const key in mutes) {
//             const expireTime = mutes[key].expireDate;
//             if (expireTime < currentTime) {
//                 delete mutes[key];
//                 console.log('deleted mute of ' + key);
//                 client.channels
//                     .fetch('781162983274971186')
//                     .then((ch) =>
//                         (ch as any).send(`<@${key}>'s mute has expired`)
//                     );
//                 client.guilds
//                     .fetch('775699083108024331')
//                     .then((g) =>
//                         g.members
//                             .fetch(key)
//                             .then((m) => m.roles.remove('785839177022963731'))
//                     );
//             }
//         }
//         fs.writeFileSync('./users/mutes.json', JSON.stringify(mutes));
//     }, 60000);
// }
// emitter.on('event1', timer);
// emitter.emit('event1');
