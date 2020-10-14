const dadJokes = require('@mikemcbride/dad-jokes');

module.exports = {
    name: 'dadjoke',
    description: 'Get a random dad joke',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        return message.channel.send(`👨 **Dad joke:** ${dadJokes.random()}`);
    },
};
