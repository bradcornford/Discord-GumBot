const { setIntervalAsync } = require('set-interval-async/dynamic')

module.exports = {
    name: 'quit',
    description: 'Quit the bot',
    hidden: true,
    run: async (client, message, args) => {
        return message.channel.send('🤖️ **Goodbye!**')
            .then(() => {
                setIntervalAsync(
                    () => {
                        console.log('Shutting down!');
                        client.destroy();
                        process.exit();
                    },
                    2000
                );
            });
    },
};
