const { validateMessageFromInput, extractMessageFromInput } = require('../includes/input');

module.exports = {
    name: 'storage',
    description: 'Calculate the amount of storage devices',
    parameters: ['x:g', 'x:sg', 'x:u', 'x:su', 'x:e', 'x:se', '(x:l)'],
    hidden: false,
    run: async (client, message, args) => {
        if (!validateMessageFromInput(args, message)) {
            return message;
        }

        let storageMessage = extractMessageFromInput(args);
        let storages = [...storageMessage.matchAll(/[0-9]+:[lsageu]+/g)]

        if (!/([0-9]+:(g|sg|u|su|e|se|l))+/.test(storageMessage) || storages.length === 0) {
            message.reply(`You didn\'t specify any storage devices!`);

            return message;
        }

        let gas = 0;
        let uranium = 0;
        let electricity = 0;

        storages.forEach((storage) => {
            let [amount, key] = storage[0].split(':');

            switch (key) {
                case 'l':
                    gas += (10000 * amount);
                    uranium += (10000 * amount);
                    electricity += (10000 * amount);
                    break;
                case 'g':
                    gas += (9820 * amount);
                    break;
                case 'sg':
                    gas += (500 * amount);
                    break;
                case 'u':
                    uranium += (9820 * amount);
                    break;
                case 'su':
                    uranium += (500 * amount);
                    break;
                case 'e':
                    electricity += (9760 * amount);
                    break;
                case 'se':
                    electricity += (500 * amount);
                    break;
            }
        });

        return message.channel.send(`🛢️ **Total storage device resources:**\nGas: ${gas.toLocaleString()}\nUranium Ore: ${uranium.toLocaleString()}\n Electricity: ${electricity.toLocaleString()}`);
    },
};
