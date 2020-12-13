import { TextChannel } from 'discord.js';
import { Mutes } from './Database';
import { client } from './Main';

async function sleep(time: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

export async function checkMutes(): Promise<void> {
    await sleep(10000);
    while (true) {
        const mutes = await Mutes.findAll({});
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
        await sleep(60000);
    }
}
