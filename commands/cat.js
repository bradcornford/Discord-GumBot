const animalAPI = require("random-animals-apis");

module.exports = {
    name: 'cat',
    description: 'Display a random cat image',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        const link = await animalAPI.getRandomCatImage();

        return message.channel.send(`🐈 **Cat picture**: ${link}`);
    },
};
