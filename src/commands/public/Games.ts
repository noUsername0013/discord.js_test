import { Message, MessageReaction, ReactionEmoji, User } from 'discord.js';
import { sleep } from '../../UtilFuncs';
import {
    Command,
    CommandInfo,
    CommandoClient,
    CommandoMessage,
} from 'discord.js-commando';

abstract class GameCommand extends Command {
    protected static players: string[] = [];
    protected static popPlayer(id: string) {
        const i = this.players.indexOf(id);
        if (i !== -1) {
            this.players.splice(i, 1);
        }
    }
    constructor(client: CommandoClient, info: CommandInfo) {
        super(client, info);
    }
}

export class NumGuessGameCommand extends GameCommand {
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
        let guessCount = 0;
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
                    return msg.say(
                        `Correct answer: ${answer}. You found the secret answer!`
                    );
                }
                if (!/^\d{4}$/i.test(response.content)) {
                    msg.say('Invalid input');
                    continue;
                }
                guessCount++;
                if (response.content === answer) {
                    NumGuessGameCommand.popPlayer(msg.author.id);
                    return msg.say(
                        `Correct answer: ${answer} with ${guessCount} guesses`
                    );
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
export class RPSGame extends GameCommand {
    constructor(client: CommandoClient) {
        super(client, {
            name: 'rpsgame',
            memberName: 'rpsgame',
            group: 'public',
            description: 'Rock paper scissors game',
            args: [
                {
                    type: 'integer',
                    key: 'rounds',
                    prompt: '',
                    default: '1',
                    min: 1,
                    max: 10,
                },
            ],
        });
    }
    async run(msg: CommandoMessage, { rounds }) {
        rounds = parseInt(rounds);
        const emojiTable = { '✂️': 'scissors', '🪨': 'rock', '🧻': 'paper' };
        const reverseEmojiTable = { scissors: '✂️', rock: '🪨', paper: '🧻' };
        const winTable = {
            rock: { rock: 'tie', paper: 'lose', scissors: 'win' },
            paper: { rock: 'win', paper: 'tie', scissors: 'lose' },
            scissors: { rock: 'lose', paper: 'win', scissors: 'tie' },
        };
        let wins = 0;
        for (let i = 0; i < rounds; i++) {
            const cGuess = ['rock', 'paper', 'scissors'][
                Math.floor(Math.random() * 3)
            ];
            const roundMsg = await msg.say(`Round ${i + 1}`);
            if (roundMsg instanceof Message) {
                roundMsg.react('✂️');
                roundMsg.react('🪨');
                roundMsg.react('🧻');
            }
            try {
                const responseEmoji = (
                    await ((roundMsg as unknown) as Message).awaitReactions(
                        (reaction: MessageReaction, user: User) => {
                            const name = reaction.emoji.name;
                            return (
                                user.id === msg.author.id &&
                                (name === '✂️' || name === '🪨' || name === '🧻')
                            );
                        },
                        { max: 1, time: 10000, errors: ['time'] }
                    )
                ).first().emoji.name;
                msg.say(`My guess: ${reverseEmojiTable[cGuess]}`);
                const response = emojiTable[responseEmoji];
                const result = winTable[response][cGuess];
                if (result === 'win') {
                    wins++;
                } else if (result === 'tie') {
                    i--;
                }
            } catch {
                return msg.say('Timed out');
            }
        }
        if (wins / rounds > 0.5) {
            return msg.say('You won!');
        } else {
            return msg.say('You lost');
        }
    }
}
