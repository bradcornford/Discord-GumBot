const { extractTimeFromInput, validateTimeFromInput } = require('../includes/input');

module.exports = {
    name: 'photon',
    description: 'Create a Photon Party event, and reminder',
    parameters: ['@', '[', 'dd-mm-yyyy hh:mm', '|', 'hh:mm' , '|' , '1d 1h 1m', ']'],
    hidden: false,
    run: async (client, message, args) => {
        let invite = require(`../commands/invite`);
        let remind = require(`../commands/remind`);

        if (!validateTimeFromInput(args, message)) {
            return message;
        }

        return invite.run(client, message, ['Photon', 'Party', '{', '✅', '|', '❓', '}', ...args])
            .then(() => {
                message.channel.send('^Use the tick on the form __only__ to confirm if you are using a *Photon Computer*.');
            })
            .then(() => {
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
                        ...extractTimeFromInput(args).subtract(10, 'minutes').format('DD-MM-YYYY HH:mm').split(' ')
                    ]
                );
            });
    },
};
