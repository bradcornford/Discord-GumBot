module.exports = {
    name: 'forum',
    description: 'Get a link to the forum',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        return message.channel.send('📖 **Here\'s a link:**\n https://www.facebook.com/groups/1501670936818701');
    },
};
