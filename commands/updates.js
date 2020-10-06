const config = require('../includes/config');

module.exports = {
    name: 'updates',
    description: 'Display a list of all updates',
    parameters: [],
    hidden: true,
    run: async (client, message, args) => {
        if (config.updates === undefined || config.updates.length === 0) {
            console.log('No updates available to send');

            return message.channel.send('📒 **Updates: - **');
        }

        let output = '📒 **Updates:**';

        for (let i = 0; i < config.updates.length; i++) {
            output = output.concat('\n       ', config.updates[i].version);
        }

        return message.channel.send(output);
    },
};
