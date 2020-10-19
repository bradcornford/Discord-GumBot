const moment = require('moment-timezone');

const { validateMessageFromInput, validateUserFromInput, validateTimeFromInput, extractMessageFromInput, extractUserFromInput, extractTimeFromInput } = require("../includes/input");

module.exports = {
    name: 'remind',
    description: 'Create a reminder',
    parameters: [
        'Message',
        '~',
        '[' , 'me', '|', 'everyone', '|', 'here', '|', 'username', ']',
        '@',
        '[', 'dd-mm-yyyy hh:mm', '|', 'hh:mm' , '|' , '1d 1h 1m 1s', ']'
    ],
    hidden: false,
    run: async (client, message, args) => {
        if (
            !validateMessageFromInput(args, message) ||
            !validateUserFromInput(args, message) ||
            !validateTimeFromInput(args, message)
        ) {
            return message;
        }

        let now = moment();
        const initialMessage = message;
        let reminderTime = extractTimeFromInput(args);
        let reminderMessage = extractMessageFromInput(args);
        let reminderUser = extractUserFromInput(args, client);

        message.author.send(`📝 **Created reminder:** ${reminderMessage} ~ ${reminderUser} @ ${reminderTime}`)
            .catch(console.error);

        console.log(`User ${initialMessage.author.username} created 'reminder': ${reminderMessage} ~ ${reminderUser} @ ${reminderTime}`);

        client.setTimeout(
            () => {
                if (reminderUser === 'me') {
                    initialMessage.reply(`**Reminder:** ${reminderMessage}`);
                } else {
                    message.channel.send(`**Reminder:** ${reminderUser}, ${reminderMessage}`);
                }

                console.log(`Finished 'reminder' for user ${initialMessage.author.username}`);
            },
            reminderTime.diff(now)
        );

        return message;
    },
};
