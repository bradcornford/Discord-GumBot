const DadJokes = require('dadjokes-wrapper');

module.exports = {
    name: 'dadjoke',
    description: 'Get a random dad joke',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        return new DadJokes().randomJoke()
            .then(joke => message.channel.send(`👨 **Dad joke:** ${joke}`))
            .catch(console.error);
    },
};
