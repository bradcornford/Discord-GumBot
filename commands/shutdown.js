module.exports = {
    name: 'shutdown',
    description: 'Shutdown the bot',
    parameters: [],
    hidden: true,
    run: async (client, message, args) => {
        let initialMessage = message;

        return message.channel.send('🤖️ **Should I shutdown?**')
            .then(message => {
                console.log(`Created 'shutdown' confirmation`);

                message.react('👍')
                    .then(() => message.react('👎'))
                    .then(() => {
                        const filter = (reaction, user) => {
                            return ['👍', '👎'].includes(reaction.emoji.name) && initialMessage.author.id === user.id;
                        };

                        message.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
                            .then(collected => {
                                const reaction = collected.first();

                                if (reaction.emoji.name === '👍') {
                                    console.log(`Result for 'shutdown': confirmed`);
                                    initialMessage.reply('Shutting down!');

                                    client.setInterval(
                                        () => {
                                            client.destroy();
                                            process.exit();
                                        },
                                        2000
                                    );
                                } else {
                                    console.log(`Result for 'shutdown': rejected`);
                                    initialMessage.reply('Shutdown aborted');
                                }
                            })
                            .catch(collected => {
                                console.log(`Result for 'shutdown': ignored`);
                                initialMessage.reply('You didn\'t react in time');
                            });
                    });
            });
    },
};
