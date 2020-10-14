const { validateMessageFromInput, validateUserFromInput, extractMessageFromInput, extractUserFromInput } = require('../includes/input')

module.exports = {
    name: 'announce',
    description: 'Send a channel announcement',
    parameters: ['Announcement', '~', '[' , 'everyone', '|', 'here', ']' ],
    hidden: false,
    run: async (client, message, args) => {
        if (!validateMessageFromInput(args, message) || !validateUserFromInput(args, message)) {
            return message;
        }

        let announcementMessage = extractMessageFromInput(args);
        let announcementUser = extractUserFromInput(args, client);

        return message.channel.send(`📢 **Announcement:** ${announcementUser}, ${announcementMessage}`);
    },
};
