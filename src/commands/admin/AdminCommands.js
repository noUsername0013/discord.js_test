"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnmuteCommand = exports.MuteCommand = exports.ListBansCommand = exports.UnbanCommand = exports.BanCommand = exports.KickCommand = exports.ExitCommand = exports.SendCommand = exports.RemoveRoleCommand = exports.AddRoleCommand = exports.AddLevelsCommand = void 0;
const botconfig_json_1 = require("../../../botconfig.json");
const discord_js_commando_1 = require("discord.js-commando");
const fs_1 = require("fs");
const Database_1 = require("../../Database");
const aliases = botconfig_json_1.commandOptions.aliases;
class AdminCommand extends discord_js_commando_1.Command {
    constructor(client, info) {
        super(client, info);
        this.userPermissions = ['ADMINISTRATOR'];
    }
}
class AddLevelsCommand extends AdminCommand {
    constructor(client) {
        super(client, {
            name: 'addlevels',
            memberName: 'addlevels',
            group: 'admin',
            description: 'Adds the specified level to the specified user',
            aliases: aliases.addlevels,
            args: [
                {
                    key: 'level',
                    type: 'integer',
                    prompt: 'Please provide the level you want to add',
                    min: -100000,
                    max: 100000,
                },
                {
                    key: 'member',
                    type: 'member',
                    prompt: '',
                    default: '',
                },
            ],
        });
    }
    async run(msg, { level, member }) {
        if (!member) {
            member = msg.guild.members.resolve(msg.author);
        }
        const user = await Database_1.Users.findOne({ where: { id: msg.author.id } });
        const dataValue = {
            id: user.get('id'),
            level: user.get('level'),
            exp: user.get('exp'),
        };
        dataValue.level += parseInt(level);
        user.update(dataValue);
        return msg.say(`<@${member.user.id}>'s level is now ${dataValue.level}`);
    }
}
exports.AddLevelsCommand = AddLevelsCommand;
class AddRoleCommand extends AdminCommand {
    constructor(client) {
        super(client, {
            name: 'addrole',
            memberName: 'addrole',
            group: 'admin',
            description: 'Adds a specified role to a specified user',
            aliases: aliases.addrole,
            args: [
                {
                    key: 'role',
                    type: 'role',
                    prompt: 'Please specifie a role to add',
                },
                {
                    key: 'member',
                    type: 'member',
                    prompt: 'Please specifie a member to add the role',
                },
            ],
        });
    }
    async run(msg, { role, member }) {
        try {
            await member.roles.add(role);
        }
        catch (err) {
            return msg.say(`Failed to add role: ${err.message}`);
        }
        return msg.say(`Successfully added ${role.name} to <@${member.user.id}>`);
    }
}
exports.AddRoleCommand = AddRoleCommand;
class RemoveRoleCommand extends AdminCommand {
    constructor(client) {
        super(client, {
            name: 'removerole',
            memberName: 'removerole',
            group: 'admin',
            description: 'Removes a specified role to a specified user',
            aliases: aliases.removerole,
            args: [
                {
                    key: 'role',
                    type: 'role',
                    prompt: 'Please specifie a role to remove',
                },
                {
                    key: 'member',
                    type: 'member',
                    prompt: 'Please specifie a member to remove the role',
                },
            ],
        });
    }
    async run(msg, { role, member }) {
        try {
            await member.roles.remove(role);
        }
        catch (err) {
            return msg.say(`Failed to remove role: ${err.message}`);
        }
        return msg.say(`Successfully removed ${role.name} from <@${member.user.id}>`);
    }
}
exports.RemoveRoleCommand = RemoveRoleCommand;
class SendCommand extends AdminCommand {
    constructor(client) {
        super(client, {
            name: 'send',
            memberName: 'send',
            group: 'admin',
            description: 'Sends a message to the specifed channel',
            aliases: aliases.send,
            args: [
                {
                    key: 'channel',
                    type: 'text-channel',
                    prompt: 'Please provide the channel you want to send the message to',
                },
                {
                    key: 'message',
                    type: 'string',
                    prompt: 'Please provide the message you want to send',
                    infinite: true,
                },
            ],
        });
    }
    async run(msg, { channel }) {
        const contentArr = msg.content.split(' ');
        contentArr.shift();
        contentArr.shift();
        try {
            await channel.send(contentArr.join(' '));
        }
        catch (err) {
            return msg.say(`Failed to sent message: ${err.message}`);
        }
        msg.say('Successfully sent message');
        return msg.delete({ timeout: 5000 });
    }
}
exports.SendCommand = SendCommand;
class ExitCommand extends AdminCommand {
    constructor(client) {
        super(client, {
            name: 'exit',
            memberName: 'exit',
            group: 'admin',
            description: 'Stops this bot',
            aliases: aliases.exit,
        });
    }
    async run(msg) {
        return msg.say('Bot stopped').then((_) => process.exit(), (_) => process.exit());
    }
}
exports.ExitCommand = ExitCommand;
class KickCommand extends AdminCommand {
    constructor(client) {
        super(client, {
            name: 'kick',
            memberName: 'kick',
            group: 'admin',
            description: 'Kicks the specified member',
            aliases: aliases.kick,
            args: [
                {
                    key: 'member',
                    type: 'member',
                    prompt: 'Please provide the member you want to kick',
                },
                {
                    key: 'reason',
                    type: 'string',
                    default: '',
                    prompt: '',
                    infinite: true,
                },
            ],
        });
    }
    async run(msg, { member, reason }) {
        reason = getReason(msg, reason);
        try {
            await member.kick(reason);
        }
        catch (err) {
            return msg.say(`Failed to kick member: ${err.message}`);
        }
        return msg.say(`Successfully kicked <@${member.user.id}> ${reason ? 'for' : ''} ${reason ? reason : ''}`);
    }
}
exports.KickCommand = KickCommand;
class BanCommand extends AdminCommand {
    constructor(client) {
        super(client, {
            name: 'ban',
            memberName: 'ban',
            group: 'admin',
            description: 'Bans the specified member',
            aliases: aliases.ban,
            args: [
                {
                    key: 'member',
                    type: 'member',
                    prompt: 'Please provide the member you want to ban',
                },
                {
                    key: 'reason',
                    type: 'string',
                    default: '',
                    prompt: '',
                    infinite: true,
                },
            ],
        });
    }
    async run(msg, { member, reason }) {
        reason = getReason(msg, reason);
        try {
            await member.ban({ days: 0, reason });
        }
        catch (err) {
            console.error(err);
            return msg.say(`Failed to ban member: ${err.message}`);
        }
        return msg.say(`Successfully banned <@${member.user.id}> ${reason ? 'for' : ''} ${reason ? reason : ''}`);
    }
}
exports.BanCommand = BanCommand;
class UnbanCommand extends AdminCommand {
    constructor(client) {
        super(client, {
            name: 'unban',
            memberName: 'unban',
            group: 'admin',
            description: 'Unbans the specified user',
            aliases: aliases.unban,
            args: [
                {
                    key: 'user',
                    type: 'user',
                    prompt: 'Please provide the user you want to unban',
                },
                {
                    key: 'reason',
                    type: 'string',
                    default: '',
                    prompt: '',
                    infinite: true,
                },
            ],
        });
    }
    async run(msg, { user, reason }) {
        reason = getReason(msg, reason);
        try {
            await msg.guild.members.unban(user.id, reason);
        }
        catch (err) {
            return msg.say(`Failed to unban member: ${err.message}`);
        }
        return msg.say(`Successfully unbanned <@${user.id}> ${reason ? 'for' : ''} ${reason ? reason : ''}`);
    }
}
exports.UnbanCommand = UnbanCommand;
class ListBansCommand extends AdminCommand {
    constructor(client) {
        super(client, {
            name: 'listbans',
            memberName: 'listbans',
            group: 'admin',
            description: 'Lists bans of the server',
            aliases: aliases.listbans,
        });
    }
    async run(msg /*{ page }*/) {
        const bans = await msg.guild.fetchBans();
        let response = '';
        let i = 1;
        //testing data
        //let bansTest: any = new Collection();
        //bansTest.set('1234567890', {user: {tag: 'abcd#1234',id: '1234567890',},reason: 'abcdefg',});
        //bansTest.set('9876543210', {user: {tag: 'dcba#4321',id: '9876543210',},reason: 'gfedcba',});
        bans.each((ban) => {
            if (response.length < 1900) {
                response += `${i++}.   Tag: ${ban.user.tag}   UserID: ${ban.user.id}   Reason: ${ban.reason}\n`;
            }
        });
        if (response === '')
            response = 'This server has no bans';
        //response += `Page ${page} of ${bans.size}`;
        return msg.say(response);
    }
}
exports.ListBansCommand = ListBansCommand;
class MuteCommand extends AdminCommand {
    constructor(client) {
        super(client, {
            name: 'mute',
            memberName: 'mute',
            group: 'admin',
            description: 'Mutes the specified member for a specified time',
            aliases: aliases.mute,
            args: [
                {
                    key: 'member',
                    type: 'member',
                    prompt: 'Please provide the member you want to mute',
                },
                {
                    key: 'duration',
                    type: 'string',
                    prompt: 'Please provide the duration of the mute',
                    validate: (input) => /((^\d+)|(^\d+\.?\d+))(s$|m$|h$|d$)/i.test(input),
                },
                {
                    key: 'reason',
                    type: 'string',
                    prompt: '',
                    default: '',
                    infinite: true,
                },
            ],
        });
    }
    async run(msg, { member, duration, reason }) {
        reason = getReason(msg, reason, 3);
        const timeUnit = duration[duration.length - 1].toLowerCase();
        let durationValue = parseFloat(duration);
        if (timeUnit === 'm')
            durationValue *= 60;
        if (timeUnit === 'h')
            durationValue *= 3600;
        if (timeUnit === 'd')
            durationValue *= 86400;
        const currentMillsecs = Date.now(); //處理日期
        const expireMillsecs = currentMillsecs + durationValue * 1000;
        const expireDate = new Date();
        expireDate.setTime(expireMillsecs);
        try {
            if (member.hasPermission('ADMINISTRATOR')) {
                //throw new Error('Cannot mute admins');
            }
            const mutes = JSON.parse(fs_1.readFileSync('./users/mutes.json', 'utf-8'));
            if (mutes[member.user.id]) {
                throw new Error(`<@${member.user.id}> was muted already`);
            }
            member.roles.add('785839177022963731');
            mutes[member.id] = {
                tag: member.user.tag,
                duration: durationValue,
                reason: reason,
                expireDate: Date.parse(expireDate.toUTCString()),
            };
            fs_1.writeFileSync('./users/mutes.json', JSON.stringify(mutes));
        }
        catch (err) {
            return msg.say(`Failed to mute member: ${err.message}`);
        }
        return msg.say(`Successfully muted <@${member.user.id}> for ${timeUnit === 's'
            ? durationValue + ' seconds'
            : timeUnit === 'm'
                ? durationValue / 60 + ' minutes'
                : timeUnit === 'h'
                    ? durationValue / 3600 + ' hours'
                    : durationValue / 86400 + ' days'}(Expires in ${expireDate.toLocaleString('en')} GMT+8) for ${reason}`);
    }
}
exports.MuteCommand = MuteCommand;
class UnmuteCommand extends AdminCommand {
    constructor(client) {
        super(client, {
            name: 'unmute',
            memberName: 'unmute',
            group: 'admin',
            description: 'Unmutes the specified member',
            args: [
                {
                    key: 'member',
                    type: 'member',
                    prompt: 'Please provide the member you want to unmute',
                },
                {
                    key: 'reason',
                    type: 'string',
                    prompt: '',
                    default: '',
                },
            ],
        });
    }
    run(msg, { member, reason }) {
        reason = getReason(msg, reason);
        try {
            if (!member.roles.cache.find((r) => r.id === '785839177022963731')) {
                throw new Error('That member is not muted');
            }
            member.roles.remove('785839177022963731');
            const mutes = JSON.parse(fs_1.readFileSync('./users/mutes.json', 'utf-8'));
            delete mutes[member.user.id];
            fs_1.writeFileSync('./users/mutes.json', JSON.stringify(mutes));
        }
        catch (err) {
            return msg.say(`Failed to unmute member: ${err.message}`);
        }
        return msg.say(`Successfully unmuted <@${member.user.id}> for ${reason}`);
    }
}
exports.UnmuteCommand = UnmuteCommand;
function getReason(msg, reason, shiftAmount) {
    const contentArr = msg.content.split(' ');
    shiftAmount = shiftAmount || 2;
    let i = 0;
    while (i <= shiftAmount) {
        contentArr.shift();
        i++;
    }
    reason = contentArr.join(' ');
    return reason;
}