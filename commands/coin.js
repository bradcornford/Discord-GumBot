module.exports = {
    name: 'coin',
    description: 'Flip a coin',
    hidden: false,
    run: async (client, message, args) => {
        let coin = ['Heads', 'Tails'];

        return message.channel.send(`🪙 **Flipped a coin: ${coin[Math.floor(Math.random() * coin.length)]}**`);
    },
};
