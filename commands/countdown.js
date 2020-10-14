const moment = require('moment-timezone');

const ms = require('string-to-ms');

const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async/dynamic');

const { validateMessageFromInput, validateUserFromInput, validateTimeFromInput, extractUserFromInput, extractTimeFromInput } = require('../includes/input');

module.exports = {
    name: 'countdown',
    description: 'Create a countdown',
    parameters: [
        '~',
        '[' , 'me', '|', 'everyone', '|', 'here', '|', 'group', ']',
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
        let countdownTime = extractTimeFromInput(args);
        let countdownMessage;
        let countdownUser = extractUserFromInput(args);

        let countdown = () => {
            if (countdownTime.diff(moment()) <= 0) {
                return `**Countdown:** Completed`;
            }

            return `**Countdown:** ${countdownTime.fromNow(true)} left`;
        };

        return message.channel.send(countdown())
            .then(message => {
                countdownMessage = message;
                console.log(`User ${initialMessage.author.username} created 'countdown'`);

                const timer = setIntervalAsync(
                    () => {
                        countdownMessage.edit(countdown())
                            .then(message => countdownMessage = message)
                            .catch(console.error);

                        if (countdownTime.diff(moment()) <= 0) {
                            if (countdownUser === 'me') {
                                initialMessage.reply(`**Countdown has completed**`);
                            } else {
                                message.channel.send(`**@${countdownUser}, Countdown has completed**`);
                            }
                            console.log(`Finished 'countdown' for user ${initialMessage.author.username}`);

                            clearIntervalAsync(timer);
                        }
                    },
                    ms('1m')
                );
            });
    },
};
