module.exports = {
    name: 'wiki',
    description: 'Get a link to the wiki',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        return message.channel.send('📚 **Here\'s a link:** \nhttps://gdmaze.fandom.com/wiki/Gumballs_%26_Dungeons_Wikia**');
    },
};
