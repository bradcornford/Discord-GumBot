const animalAPI = require("random-animals-api");

module.exports = {
    name: 'cat',
    description: 'Display a random cat image',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        return animalAPI.cat()
            .then(link => message.channel.send(`🐈 **Cat picture**: ${link}`))
            .catch(console.error);
    },
};
