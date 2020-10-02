module.exports = {
    name: 'poll',
    description: 'Initiate a simple yes/no poll',
    parameters: ['Question?'],
    hidden: false,
    run: async (client, message, args) => {
        if (args.length === 0 || typeof args[0] !== string) {
            return message.channel.send(`You didn\'t specify the question for the poll!`);
        }

        return message.channel.send(`📋 **${args.join(' ')}**`)
            .then(message => {
                message.react('👍');
                message.react('👎');
            });
    },
};
