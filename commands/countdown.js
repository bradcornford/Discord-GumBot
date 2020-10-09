const moment = require('moment-timezone');

const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async/dynamic');

const ms = require('ms');

module.exports = {
    name: 'countdown',
    description: 'Create a countdown',
    parameters: ['dd-mm-yyyy hh:mm'],
    hidden: false,
    run: async (client, message, args) => {
        if (args.length === 0 || typeof args[0] !== 'string') {
            return message.reply(`You didn\'t specify the date and time for the countdown!`);
        }

        if (!/[0-9]{2}-[0-9]{2}-[0-9]{4} [0-9]{2}:[0-9]{2}$/.test(args.join(' '))) {
            return message.reply(`You didn\'t specify the countdown date and time in a valid format!`);
        }

        let now = moment();
        const eventTime = moment(args.join(' ').concat(':00'), 'DD-MM-YYYY hh:mm:ss');

        if (eventTime.diff(now) <= 0) {
            return message.reply(`Countdown occurs in the past!`);
        }

        const initialMessage = message;

        let countdownMessage;

        let countdown = () => {
            if (eventTime.diff(moment()) <= 0) {
                return `**Countdown:** Completed`;
            }

            return `**Countdown:** ${eventTime.fromNow(true)} left`;
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

                        if (eventTime.diff(moment()) <= 0) {
                            initialMessage.reply(`**Countdown has completed**`);
                            console.log(`Finished 'countdown' for user ${initialMessage.author.username}`);

                            clearIntervalAsync(timer);
                        }
                    },
                    ms('1m')
                );
            });
    },
};
