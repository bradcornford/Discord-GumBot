module.exports = {
    name: 'forum',
    description: 'Get a link to the forum',
    hidden: false,
    run: async (client, message, args) => {
        return message.channel.send('📖 **Here\'s a link: https://www.facebook.com/groups/1501670936818701**');
    },
};
