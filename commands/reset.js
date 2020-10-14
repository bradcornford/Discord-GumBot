const moment = require('moment-timezone');

module.exports = {
    name: 'reset',
    description: 'Display when the game server resets',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        let now = moment();
        let gameTime = now.clone().tz('Asia/Shanghai');
        let gameResetTime = gameTime.clone().endOf('day');

        return message.channel.send(`🔁 **Game resets:** ${gameResetTime.fromNow(true)}`);
    },
};
