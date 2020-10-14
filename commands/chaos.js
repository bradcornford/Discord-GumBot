const ms = require('string-to-ms');
const moment = require('moment-timezone');

module.exports = {
    name: 'chaos',
    description: 'Display date and time of next Chaos round',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        let initialChaosEndTime = moment('11-10-2020 01:00:00', 'DD-MM-YYYY hh:mm:ss');
        let now = moment();
        let chaosInterval = ms('14d 4h');
        let chaosPeriod = ms('12h');
        let chaosCount = (Math.floor(now.diff(initialChaosEndTime) / chaosInterval));
        let nextChaosTime = initialChaosEndTime.add((chaosInterval * (chaosCount + 1)) + (chaosPeriod * chaosCount));

        return message.channel.send(`🚀 **Next Chaos:** ${nextChaosTime}`);
    },
};