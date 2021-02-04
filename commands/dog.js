const animalAPI = require("random-animals-api");

module.exports = {
    name: 'dog',
    description: 'Display a random dog image',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        return animalAPI.dog()
            .then(link => message.channel.send(`🐕 **Dog picture**: ${link}`))
            .catch(console.error);
    },
};
