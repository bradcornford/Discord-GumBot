module.exports = {
    name: 'wiki',
    description: 'Get a link to the wiki',
    hidden: false,
    run: async (client, message, args) => {
        return message.channel.send('📚 **Here\'s a link: https://gdmaze.fandom.com/wiki/Gumballs_%26_Dungeons_Wikia**');
    },
};
