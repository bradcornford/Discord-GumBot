const {validateMessageFromInput} = require("../includes/input");
module.exports = {
    name: 'rps',
    description: 'Play rock paper scissors',
    parameters: ['[', 'rock', '|', 'paper', '|', 'scissors', ']'],
    hidden: false,
    run: async (client, message, args) => {
        let userChoice = args.join(' ');

        if (
            !validateMessageFromInput(args, message) ||
            (
                !userChoice.includes('rock') &&
                !userChoice.includes('paper') &&
                !userChoice.includes('scissors')
            )
        ) {
            return message;
        }

        switch (userChoice) {
            case 'rock':
                userChoice = 0;
                break;
            case 'paper':
                userChoice = 1;
                break;
            case 'scissors':
                userChoice = 2;
                break;
        }

        let choices = ['✊', '✋', '✌️️'];
        let botChoice = Math.floor(Math.random() * choices.length);
        let winner;

        if (
            (botChoice === 0 && userChoice === 2) ||
            (botChoice === 1 && userChoice === 0) ||
            (botChoice === 2 && userChoice === 1)
        ) {
            winner = `Winner ${client.user.toString()}!`;
        } else if (
            (userChoice === 0 && botChoice === 2) ||
            (userChoice === 1 && botChoice === 0) ||
            (userChoice === 2 && botChoice === 1)
        ) {
            winner = `Winner ${message.author.toString()}!`;
        } else if (botChoice === userChoice) {
            winner = 'It\'s a draw!';
        }

        return message.channel.send(`🕹️ **Rock paper scissors:** I choose ${choices[botChoice]} . ${winner}`);
    },
};
