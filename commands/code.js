const config = require('../includes/config');

module.exports = {
    name: 'code',
    description: 'Display the current code',
    hidden: false,
    run: async (client, message, args) => {
        if (config.codes === undefined || config.codes.length === 0) {
            console.log('No codes available to send');

            return message.channel.send('💬 **Current Code: - **');
        }

        return message.channel.send(`💬 **Current Code: ${config.codes[0].code}**`);
    },
};
