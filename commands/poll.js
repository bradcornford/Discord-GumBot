const { Collection } = require('discord.js');

module.exports = {
    name: 'poll',
    description: 'Initiate a 5 minute yes/no poll',
    parameters: ['Question?'],
    hidden: false,
    run: async (client, message, args) => {
        if (args.length === 0 || typeof args[0] !== 'string') {
            return message.reply(`You didn\'t specify the question for the poll!`);
        }

        const initialMessage = message;
        const reactedUsers = new Collection();

        return message.channel.send(`📋 **${args.join(' ')}**`)
            .then(message => {
                console.log(`User ${initialMessage.author.username} created 'poll'`);

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

                        const collector = message.createReactionCollector(filter, { time: 300000, dispose: true });

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
