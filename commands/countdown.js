const moment = require('moment-timezone');

const ms = require('string-to-ms');

const { validateMessageFromInput, validateUserFromInput, validateTimeFromInput, extractMessageFromInput, extractUserFromInput, extractTimeFromInput } = require('../includes/input');

const { timeDuration } = require('../includes/timeDuration');

module.exports = {
    name: 'countdown',
    description: 'Create a countdown',
    parameters: [
        '(Event Name)',
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

        let now = moment();
        const initialMessage = message;
        let countdownMessage = message;
        let countdownEvent = extractMessageFromInput(args);
        let countdownUser = extractUserFromInput(args, client);
        let countdownTime = extractTimeFromInput(args);

        let countdown = () => {
            let remaining = countdownTime.diff(moment());

            if (remaining <= 0) {
                return `**Countdown:** Completed${(countdownEvent !== '' ? ` for: ${countdownEvent}` : '')}`;
            }

            return `**Countdown:** ${timeDuration(remaining)} left${(countdownEvent !== '' ? ` until: ${countdownEvent}` : '')}`;
        };

        message.author.send(`⏰ **Created countdown:** ${countdownEvent} ~ ${countdownUser} @ ${countdownTime}`)
            .catch(console.error);

        return message.channel.send(countdown())
            .then(message => {
                countdownMessage = message;
                console.log(`User ${initialMessage.author.username} created 'countdown': ${countdownEvent} ~ ${countdownUser} @ ${countdownTime}`);

                const collector = message.createReactionCollector(() => { return false; }, { time: countdownTime.diff(now) + ms('1m'), dispose: true });

                collector.on('end', () => {
                    console.log(`Finished 'countdown' for user ${initialMessage.author.username}`);
                    client.clearInterval(timer);
                });

                const timer = client.setInterval(
                    () => {
                        countdownMessage.edit(countdown())
                            .then(message => countdownMessage = message)
                            .catch(error => {
                                console.error(error);
                                client.clearInterval(timer);
                            });

                        if (countdownTime.diff(moment()) <= 0) {
                            if (countdownUser === 'me') {
                                initialMessage.reply(`**Countdown has completed${(countdownEvent !== '' ? ` for: ${countdownEvent}` : '')}**`)
                                    .catch(console.error);
                            } else {
                                message.channel.send(`**${countdownUser}, Countdown has completed${(countdownEvent !== '' ? ` for: ${countdownEvent}` : '')}**`)
                                    .catch(console.error);
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
