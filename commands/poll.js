const { Collection } = require('discord.js');

const moment = require('moment-timezone');

const { validateMessageFromInput, validateTimeFromInput, extractMessageFromInput, extractTimeFromInput } = require('../includes/input');

module.exports = {
    name: 'poll',
    description: 'Initiate a timed yes/no poll',
    parameters: [ 'Question?', '@', '[', 'dd-mm-yyyy hh:mm', '|', 'hh:mm' , '|' , '1d 1h 1m', ']' ],
    hidden: false,
    run: async (client, message, args) => {
        if (
            !validateMessageFromInput(args, message) ||
            !validateMessageFromInput(args, message)||
            !validateTimeFromInput(args, message)
        ) {
            return message;
        }

        let now = moment();
        const initialMessage = message;
        let pollTime = extractTimeFromInput(args);
        let pollMessage = extractMessageFromInput(args);
        const reactedUsers = new Collection();

        message.author.send(`📋 **Created poll:** ${pollMessage} @ ${pollTime}`)
            .catch(console.error);

        return message.channel.send(`📋 **${pollMessage}**`)
            .then(message => {
                console.log(`User ${initialMessage.author.username} created 'poll': ${pollMessage} @ ${pollTime}`);

                message.react('👍')
                    .then(() => message.react('👎'))
                    .then(() => {
                        const filter = (reaction, user) => {
                            if (!['👍', '👎'].includes(reaction.emoji.name)) {
                                reaction.users.reaction.users.remove(user.id)
                                    .then(() => console.log(`Deleted unrecognised 'poll' reaction from ${user.username}`))
                                    .catch(console.error);

                                return false;
                            }

                            if (reactedUsers.get(user.id)) {
                                reaction.users.reaction.users.remove(user.id)
                                    .then(() => console.log(`Deleted multiple 'poll' reaction from ${user.username}`))
                                    .catch(console.error);

                                return false;
                            }

                            console.log(`Recognised 'poll' reaction '${reaction.emoji.name}' from ${user.username}`);

                            return true;
                        };

                        const collector = message.createReactionCollector(filter, { time: pollTime.diff(now), dispose: true });

                        collector.on('collect', (reaction, user) => {
                            reactedUsers.set(user.id, user.username);
                        });

                        collector.on('remove', (reaction, user) => {
                            reactedUsers.delete(user.id);
                        });

                        collector.on('end', collected => {
                            let yes = (typeof collected.get('👍') === 'undefined' ? 0 : (collected.get('👍').count - 1));
                            let no = (typeof collected.get('👎') === 'undefined' ? 0 : (collected.get('👎').count - 1));

                            initialMessage.reply(`**Results are in:** ${yes} Yes / ${no} No`);

                            console.log(`Results for user ${initialMessage.author.username} 'poll': ${yes} Yes / ${no} No`);
                        });
                    })
                    .catch(console.error);
            });
    }
};
