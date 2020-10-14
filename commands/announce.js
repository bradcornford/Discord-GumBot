const { validateMessageFromInput, validateUserFromInput, extractMessageFromInput, extractUserFromInput } = require('../includes/input')

module.exports = {
    name: 'announce',
    description: 'Send a channel announcement',
    parameters: ['Announcement', '~', '[' , 'everyone', '|', 'here', '|', 'group', ']' ],
    hidden: false,
    run: async (client, message, args) => {
        if (!validateMessageFromInput(args, message) || !validateUserFromInput(args, message)) {
            return message;
        }

        let announcement = extractMessageFromInput(args);
        let user = extractUserFromInput(args);

        return message.channel.send(`📢 **Announcement:** @${user}, ${announcement}`);
    },
};
