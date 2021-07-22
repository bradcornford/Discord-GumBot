const { getdadjoke } = require('get-dadjoke');

module.exports = {
    name: 'dadjoke',
    description: 'Get a random dad joke',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        return getdadjoke()
            .then(joke => message.channel.send(`👨 **Dad joke:** ${joke}`))
            .catch(console.error);
    },
};
