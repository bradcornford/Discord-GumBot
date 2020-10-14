const animalAPI = require("random-animals-apis");

module.exports = {
    name: 'dog',
    description: 'Display a random dog image',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        const link = await animalAPI.getRandomDogImage();

        return message.channel.send(`🐕 **Dog picture**: ${link}`);
    },
};
