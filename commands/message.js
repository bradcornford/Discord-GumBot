const { validateMessageFromInput, extractMessageFromInput } = require('../includes/input')

module.exports = {
    name: 'message',
    description: 'Send a message',
    parameters: [ 'Message' ],
    hidden: false,
    run: async (client, message, args) => {
        if (!validateMessageFromInput(args, message)) {
            return message;
        }

        let messageMessage = extractMessageFromInput(args);

        message.author.send(`💬 **Created Message:** ${messageMessage}`)
            .catch(console.error);

        console.log(`User ${message.author.username} created 'message': ${messageMessage}`);

        return message.channel.send(`${messageMessage}`);
    },
};
