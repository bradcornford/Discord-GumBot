module.exports = {
    name: 'dice',
    description: 'Roll a dice',
    hidden: false,
    run: async (client, message, args) => {
        let die = ['1', '2', '3', '4', '5', '6'];

        return message.channel.send(`🎲 **Rolled a dice: ${die[Math.floor(Math.random() * die.length)]}**`);
    },
};
