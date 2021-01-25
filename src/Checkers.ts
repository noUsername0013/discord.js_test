import { TextChannel } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import { Mutes, Birthdays } from './Database';

export async function checkMutes(client: CommandoClient): Promise<void> {
    const mutes = await Mutes.findAll({});
    mutes.forEach(async (m) => {
        if (m.get('expireDate') < Date.now()) {
            console.log('removing mute of ' + m.get('id'));
            const user = await client.users.fetch(m.get('id') as string);
            const guild = await client.guilds.fetch(m.get('guildId') as string);
            const member = await guild.members.fetch(user.id);
            member.roles.remove('785839177022963731');
            m.destroy();
            const channel = guild.channels.cache.get(
                '781162983274971186'
            ) as TextChannel;
            channel.send(`<@${user.id}>'s mute has expired`);
        }
    });
}

let sentToday = [];
let checkedCount = 0;
export async function checkBirthdays(client: CommandoClient): Promise<void> {
    const birthdays = await Birthdays.findAll({});
    birthdays.forEach(async (b) => {
        const user = await client.users.fetch(b.get('userId') as string);
        const date = new Date();
        if (
            (date.getMonth() + 1).toString() +
                '/' +
                date.getDate().toString() ===
            b.get('birthday')
        ) {
            if (!sentToday.includes(user.id)) {
                user.send(`${b.get('name')}'s birthday is today!`);
                sentToday.push(user.id);
            }
        }
    });
    checkedCount++;
    if (checkedCount > 24) {
        checkedCount = 0;
        sentToday = [];
    }
}
