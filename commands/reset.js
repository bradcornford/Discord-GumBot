const moment = require('moment-timezone');

module.exports = {
    name: 'reset',
    description: 'Display a list of current times',
    hidden: false,
    run: async (client, message, args) => {
        let now = moment();
        let gameTime = now.clone().tz('Asia/Shanghai');
        let gameResetTime = gameTime.clone().endOf('day');

        return message.channel.send(`🔁 **Game resets: ${gameResetTime.diff(gameTime, 'hours')}h ${(gameResetTime.diff(gameTime, 'minutes') % 60)}m**`);
    },
};
