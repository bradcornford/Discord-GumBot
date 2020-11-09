module.exports = {
    name: 'whoami',
    description: 'Who am I?',
    parameters: [],
    hidden: true,
    run: async (client, message, args) => {
        return message.channel.send(`🤖️ **I am GumBot. Master of bots, automater of Scans! #scanbot3000**`);
    },
};
