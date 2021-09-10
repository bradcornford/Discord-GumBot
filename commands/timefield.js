const { getNextTimefieldDatetime } = require('../includes/timefield');

module.exports = {
    name: 'timefield',
    description: 'Display date and time of next Timefield reset',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        let nextTimefieldTime = getNextTimefieldDatetime();

        return message.channel.send(`🪐 **Next Timefield:** ${nextTimefieldTime}`);
    },
};
