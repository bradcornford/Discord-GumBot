const { validateMessageFromInput } = require('../includes/input');

module.exports = {
    name: '8ball',
    description: 'Ask magic 8-ball a question',
    parameters: ['Question?'],
    hidden: false,
    run: async (client, message, args) => {
        if (!validateMessageFromInput(args, message)) {
            return message;
        }

        let answers = [
            'It is certain.',
            'It is decidedly so.',
            'Without a doubt.',
            'Yes – definitely.',
            'You may rely on it.',
            'As I see it, yes.',
            'Most likely.',
            'Outlook good.',
            'Yes.',
            'Signs point to yes.',
            'Reply hazy, try again.',
            'Ask again later.',
            'Better not tell you now.',
            'Cannot predict now.',
            'Concentrate and ask again.',
            'Don\'t count on it.',
            'My reply is no.',
            'My sources say no.',
            'Outlook not so good.',
            'Very doubtful.',
        ];

        return message.channel.send(`🎱 **Magic 8-ball:** ${answers[Math.floor(Math.random() * answers.length)]}`);
    },
};
