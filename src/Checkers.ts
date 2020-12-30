import { TextChannel } from 'discord.js';
import { CommandoClient } from 'discord.js-commando';
import { Mutes, Birthdays } from './Database';

async function sleep(time: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

export async function checkers(): Promise<void> {
    let sentToday = [];
    let checkedCount = 0;
    await sleep(10000);
    const client: CommandoClient = globalThis.client;
    while (true) {
        const mutes = await Mutes.findAll({});
        const birthdays = await Birthdays.findAll({});
        mutes.forEach(async (m) => {
            if ((await m.get('expireDate')) < Date.now()) {
                console.log('removing mute of ' + m.get('id'));
                const user = await client.users.fetch(m.get('id') as string);
                const guild = await client.guilds.fetch(
                    m.get('guildId') as string
                );
                const member = await guild.members.fetch(user.id);
                member.roles.remove('785839177022963731');
                m.destroy();
                const channel = guild.channels.cache.get(
                    '781162983274971186'
                ) as TextChannel;
                channel.send(`<@${user.id}>'s mute has expired`);
            }
        });
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
        await sleep(3600000);
    }
}
