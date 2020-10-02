module.exports = {
    name: 'announce',
    description: 'Send a channel announcement',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        return message.channel.send(`📢 **Announcement: @everyone ${args.join(' ')}**`);
    },
};
