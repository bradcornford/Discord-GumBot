const animals = require('random-animal.js');

module.exports = {
    name: 'dog',
    description: 'Display a random dog image',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        return animals.randomDog()
            .then(link => message.channel.send(`🐕 **Dog picture**: ${link}`))
            .catch(console.error);
    },
};
