const moment = require('moment-timezone');

module.exports = {
    name: 'time',
    description: 'Display a list of current times',
    hidden: false,
    run: async (client, message, args) => {
        let now = moment();
        let gameTime = now.clone().tz('Asia/Shanghai');

        return message.channel.send(
            '🕰️ **Times:**\n' +
            `**Game:**       ${gameTime.format('hh:mm A')}\n` +
            `**India:**         ${gameTime.clone().tz('Asia/Colombo').format('hh:mm A')}\n` +
            `**California:** ${gameTime.clone().tz('America/Los_Angeles').format('hh:mm A')}\n` +
            `**New York:** ${gameTime.clone().tz('America/New_York').format('hh:mm A')}\n` +
            `**London:**     ${gameTime.clone().tz('Europe/London').format('hh:mm A')}\n` +
            `**Berlin:**         ${gameTime.clone().tz('Europe/Berlin').format('hh:mm A')}\n`  +
            `**Sydney:**      ${gameTime.clone().tz('Australia/Sydney').format('hh:mm A')}\n` +
            `**China:**         ${gameTime.clone().tz('Asia/Shanghai').format('hh:mm A')}\n` +
            `**Tokyo:**        ${gameTime.clone().tz('Asia/Tokyo').format('hh:mm A')}\n`
        );
    },
};
