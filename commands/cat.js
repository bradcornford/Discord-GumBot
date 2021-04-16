const animals = require('random-animal.js');

module.exports = {
    name: 'cat',
    description: 'Display a random cat image',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        return animals.randomCat()
            .then(link => message.channel.send(`🐈 **Cat picture**: ${link}`))
            .catch(console.error);
    },
};
