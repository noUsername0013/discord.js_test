import { Mutes } from './Database';
import { client } from './Main';

async function sleep(time: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, time);
    });
}

export async function checkMutes(): Promise<void> {
    while (true) {
        const mutes = await Mutes.findAll({});
        mutes.forEach(async (m) => {
            if ((await m.get('expireDate')) < Date.now()) {
                const member = await (
                    await client.guilds.fetch(
                        (await m.get('guildId')) as string
                    )
                ).members.fetch((await m.get('id')) as string);
                member.roles.remove('785839177022963731');
                m.destroy();
            }
        });
        console.log(mutes);
        await sleep(5000);
    }
}
