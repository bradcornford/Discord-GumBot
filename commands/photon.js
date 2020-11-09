const ms = require('string-to-ms');

const { extractTimeFromInput } = require('../includes/input');

module.exports = {
    name: 'photon',
    description: 'Create a Photon Party event, and reminder',
    parameters: ['@', '[', 'dd-mm-yyyy hh:mm', '|', 'hh:mm' , '|' , '1d 1h 1m', ']'],
    hidden: false,
    run: async (client, message, args) => {
        let invite = require(`../commands/invite`);
        let remind = require(`../commands/remind`);

        return invite.run(client, message, ['Photon', 'Party', ...args])
            .then(() => {
                message.channel.send('^Use the tick on the form __only__ to confirm if you are using a *Photon Computer*.');
            })
            .then(() => {
                let reminderTime = extractTimeFromInput(args);

                remind.run(
                    client,
                    message,
                    [
                        'Photon',
                        'Party',
                        'starting',
                        'shortly',
                        '~',
                        'everyone',
                        '@',
                        reminderTime.subtract(ms('10m')).format('DD-MM-YYYY hh:mm')
                    ]
                );
            });
    },
};
