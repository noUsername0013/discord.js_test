import { Message } from 'discord.js';
import { Command, CommandoClient, CommandoMessage } from 'discord.js-commando';

export class NumGuessGameCommand extends Command {
    private static players: string[] = [];
    private static popPlayer(id: string) {
        const i = NumGuessGameCommand.players.indexOf(id);
        if (i !== -1) {
            NumGuessGameCommand.players.splice(i, 1);
        }
    }
    constructor(client: CommandoClient) {
        super(client, {
            name: 'numberguess',
            memberName: 'numberguess',
            group: 'public',
            description: 'Number guessing game',
        });
    }
    async run(msg: CommandoMessage) {
        if (NumGuessGameCommand.players.includes(msg.author.id))
            return msg.say("You're already in the game");
        NumGuessGameCommand.players.push(msg.author.id);
        const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        let answer = '';
        for (let i = 0; i < 4; i++) {
            answer =
                digits
                    .splice(Math.floor(Math.random() * (10 - i)), 1)
                    .toString() + answer;
        }

        try {
            msg.say('Enter a 4 digit number. Enter exit to exit');
            while (true) {
                const response = (
                    await msg.channel.awaitMessages(
                        (guess: Message) => guess.author.id === msg.author.id,
                        { time: 180000, errors: ['time'], max: 1 }
                    )
                ).first();
                if (
                    response.content.toLowerCase() === 'cancel' ||
                    response.content.toLowerCase() === 'exit'
                ) {
                    NumGuessGameCommand.popPlayer(msg.author.id);
                    return msg.say('Exited');
                }
                if (response.content.toLowerCase() === 'debug') {
                    NumGuessGameCommand.popPlayer(msg.author.id);
                    return msg.say('Correct answer: ' + answer);
                }
                if (!/^\d{4}$/i.test(response.content)) {
                    msg.say('Invalid input');
                    continue;
                }
                if (response.content === answer) {
                    NumGuessGameCommand.popPlayer(msg.author.id);
                    return msg.say('Correct answer: ' + answer);
                } else {
                    let aCount = 0,
                        bCount = 0;
                    for (let i = 0; i < 4; i++) {
                        if (response.content[i] === answer[i]) {
                            aCount++;
                            continue;
                        }
                        if (answer.includes(response.content[i])) bCount++;
                    }
                    msg.say(
                        `${aCount}A${bCount}B\nEnter a 4 digit number. Enter exit to exit`
                    );
                }
            }
        } catch {
            NumGuessGameCommand.popPlayer(msg.author.id);
            return msg.say('Timed out');
        }
    }
}
