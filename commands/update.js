const config = require('../includes/config');

module.exports = {
    name: 'update',
    description: 'Display the update announcement',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        if (config.updates === undefined || config.updates.length === 0) {
            console.log('No update available to send');

            return message.channel.send('💬 **Current Update:** -');
        }

        return message.channel.send(`💬 **Current Update:** ${config.updates[0].version}`);
    },
};
