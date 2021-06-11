const ms = require('string-to-ms');

const { validateMessageFromInput, extractMessageFromInput } = require('../includes/input');

const { timeDuration } = require('../includes/timeDuration');

module.exports = {
    name: 'accelerator',
    description: 'Calculate the time of accelerators',
    parameters: ['x:7d', 'x:3d', 'x:24h', 'x:8h', 'x:3h', 'x:60m', 'x:30m', 'x:15m', 'x:10m', 'x:5m', 'x:1m'],
    hidden: false,
    run: async (client, message, args) => {
        if (!validateMessageFromInput(args, message)) {
            return message;
        }

        let acceleratorMessage = extractMessageFromInput(args);
        let accelerators = [...acceleratorMessage.matchAll(/[0-9]+:[0-9]+[dhm]/g)]

        if (!/([0-9]+:[0-9]+[dhm])+/.test(acceleratorMessage) || accelerators.length === 0) {
            message.reply(`You didn\'t specify any accelerators!`);

            return message;
        }

        let duration = 0;

        accelerators.forEach((accelerator) => {
            let [amount, time] = accelerator[0].split(':');
            duration += (amount * ms(time));
        });

        return message.channel.send(`📦 **Total accelerators:**\n${timeDuration(duration, true, false)}`);
    },
};
