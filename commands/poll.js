module.exports = {
    name: 'poll',
    description: 'Initiate a 5 minute yes/no poll',
    parameters: ['Question?'],
    hidden: false,
    run: async (client, message, args) => {
        if (args.length === 0 || typeof args[0] !== 'string') {
            return message.channel.send(`You didn\'t specify the question for the poll!`);
        }

        const filter = (reaction, user) => {
            if (!['👍', '👎'].includes(reaction.emoji.name)) {
                reaction.users.reaction.users.remove(user.id)
                    .then(() => console.log(`Deleted unrecognised 'poll' reaction from ${user.username}`))
                    .catch(console.error);
            } else {
                console.log(`Recognised 'poll' reaction '${reaction.emoji.name}' from ${user.username}`);
            }

            return ['👍', '👎'].includes(reaction.emoji.name);
        };

        return message.channel.send(`📋 **${args.join(' ')}**`)
            .then(message => {
                console.log(`Created 'poll'`);

                message.react('👍')
                    .then(() => message.react('👎'))
                    .then(() => {
                        message.awaitReactions(filter, { time: 300000, errors: ['time'] })
                            .catch(collected => {
                                let yes = (typeof collected.get('👍') === 'undefined' ? 0 : (collected.get('👍').count - 1));
                                let no = (typeof collected.get('👎') === 'undefined' ? 0 : (collected.get('👎').count - 1));

                                message.reply(`**Results are in:** ${yes} Yes / ${no} No`);

                                console.log(`Results for 'poll' ${yes} Yes / ${no} No`);
                            });
                    })
                    .catch(console.error);
            });
    }
};
