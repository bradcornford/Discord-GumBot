const moment = require('moment-timezone');

const ms = require('string-to-ms');

const { validateMessageFromInput, validateUserFromInput, validateTimeFromInput, extractMessageFromInput, extractUserFromInput, extractTimeFromInput } = require('../includes/input');

module.exports = {
    name: 'countdown',
    description: 'Create a countdown',
    parameters: [
        '(Event)',
        '~',
        '[' , 'me', '|', 'everyone', '|', 'here', '|', 'username', ']',
        '@',
        '[', 'dd-mm-yyyy hh:mm', '|', 'hh:mm' , '|' , '1d 1h 1m', ']'
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

        const initialMessage = message;
        let countdownMessage = extractMessageFromInput(args);
        let countdownUser = extractUserFromInput(args, client);
        let countdownTime = extractTimeFromInput(args);

        let countdown = () => {
            if (countdownTime.diff(moment()) <= 0) {
                return `**Countdown:** Completed`;
            }

            return `**Countdown:** ${countdownTime.fromNow(true)} left ${(countdownMessage !== '' ? `until ${countdownMessage}` : '')}`;
        };

        message.author.send(`⏰ **Created countdown:** ${countdownMessage} ~ ${countdownUser} @ ${countdownTime}`)
            .catch(console.error);

        return message.channel.send(countdown())
            .then(message => {
                countdownMessage = message;
                console.log(`User ${initialMessage.author.username} created 'countdown': ${countdownMessage} ~ ${countdownUser} @ ${countdownTime}`);

                const timer = client.setInterval(
                    () => {
                        countdownMessage.edit(countdown())
                            .then(message => countdownMessage = message)
                            .catch(console.error);

                        if (countdownTime.diff(moment()) <= 0) {
                            if (countdownUser === 'me') {
                                initialMessage.reply(`**Countdown has completed**`);
                            } else {
                                message.channel.send(`**${countdownUser}, Countdown has completed**`);
                            }

                            console.log(`Finished 'countdown' for user ${initialMessage.author.username}`);

                            client.clearInterval(timer);
                        }
                    },
                    ms('1m')
                );
            });
    },
};
