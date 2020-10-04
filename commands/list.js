const config = require('../includes/config');

module.exports = {
    name: 'list',
    description: 'Display a list of all codes',
    parameters: [],
    hidden: true,
    run: async (client, message, args) => {
        if (config.codes === undefined || config.codes.length === 0) {
            console.log('No codes available to send');

            return message.channel.send('💬 **Codes: - **');
        }

        let output = '💬 **Codes:**';

        for (let i = 0; i < config.codes.length; i++) {
            output = output.concat('\n       ', config.codes[i].code);
        }

        return message.channel.send(output);
    },
};
