const moment = require('moment-timezone');

module.exports = {
    name: 'remind',
    description: 'Create a reminder',
    parameters: ['Message', '@', 'dd-mm-yyyy hh:mm'],
    hidden: false,
    run: async (client, message, args) => {
        if (args.length === 0 || typeof args[0] !== 'string') {
            return message.reply(`You didn\'t specify the reminder or date and time for the invite!`);
        }

        if (args.indexOf('@') === -1) {
            return message.reply(`You didn\'t specify the reminder date and time for the invite!`);
        }

        if (!/[0-9]{2}-[0-9]{2}-[0-9]{4} [0-9]{2}:[0-9]{2}$/.test(args.join(' '))) {
            return message.reply(`You didn\'t specify the reminder date and time in a valid format!`);
        }

        let now = moment();
        const reminderTime = moment(args.slice((args.indexOf('@') + 1), args.length).join(' ').concat(':00'), 'DD-MM-YYYY hh:mm:ss');

        if (reminderTime.diff(now) <= 0) {
            return message.reply(`Reminder occurs in the past!`);
        }

        const initialMessage = message;
        let reminderMessage = args.slice(0, args.indexOf('@')).join(' ');

        return message.channel.send(`📝 **Created reminder:** ${initialMessage.author.username} - ${reminderTime}`)
            .then(() => {
                console.log(`User ${initialMessage.author.username} created 'reminder'`);

                client.setTimeout(
                    () => {
                        initialMessage.reply(`**Reminder:** ${reminderMessage}`);
                        console.log(`Finished 'reminder' for user ${initialMessage.author.username}`);
                    },
                    reminderTime.diff(now)
                );
            });
    },
};
