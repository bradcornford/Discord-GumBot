const { setIntervalAsync } = require('set-interval-async/dynamic')

module.exports = {
    name: 'shutdown',
    description: 'Shutdown the bot',
    parameters: [],
    hidden: true,
    run: async (client, message, args) => {
        let userMessage = message;

        return message.channel.send('🤖️ **Should I shutdown?**')
            .then(message => {
                console.log(`Created 'shutdown' confirmation`);

                message.react('👍')
                    .then(() => message.react('👎'))
                    .then(() => {
                        const filter = (reaction, user) => {
                            return ['👍', '👎'].includes(reaction.emoji.name);
                        };

                        message.awaitReactions(filter, { max: 1, time: 10000, errors: ['time'] })
                            .then(collected => {
                                const reaction = collected.first();

                                if (reaction.emoji.name === '👍') {
                                    console.log(`Result for 'shutdown': confirmed`);
                                    userMessage.reply('Shutting down!');

                                    setIntervalAsync(
                                        () => {
                                            client.destroy();
                                            process.exit();
                                        },
                                        2000
                                    );
                                } else {
                                    console.log(`Result for 'shutdown': rejected`);
                                    userMessage.reply('Shutdown aborted');
                                }
                            })
                            .catch(collected => {
                                console.log(`Result for 'shutdown': ignored`);
                                userMessage.reply('You didn\'t react in time');
                            });
                    });
            });
    },
};
