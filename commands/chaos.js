const { getNextChaosDatetime } = require('../includes/chaos');

module.exports = {
    name: 'chaos',
    description: 'Display date and time of next Chaos round',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        return message.channel.send(`🚀 **Next Chaos:** ${getNextChaosDatetime()}`);
    },
};
