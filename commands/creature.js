const ms = require('string-to-ms');
const moment = require('moment-timezone');

module.exports = {
    name: 'creature',
    description: 'Display date and time of next Chaos Giant Creature respawn',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        let initialChaosEndTime = moment('11-10-2020 01:00:00', 'DD-MM-YYYY hh:mm:ss').tz('Europe/London');
        let now = moment().tz('Europe/London');
        let chaosInterval = ms('13d 12h');
        let chaosPeriod = ms('12h');
        let chaosCount = (Math.floor(now.diff(initialChaosEndTime) / chaosInterval));
        let currentlyInChaos = ((now.diff(initialChaosEndTime) % chaosInterval) < 43200000);
        let currentChaosTime = initialChaosEndTime.clone().add((chaosInterval * (chaosCount + (currentlyInChaos ? 0 : 1))) + (chaosPeriod * (currentlyInChaos ? chaosCount - 1 : chaosCount)));
        let nextChaosTime = initialChaosEndTime.clone().add((chaosInterval * (chaosCount + 1)) + (chaosPeriod * chaosCount));
        let nextChaosGiantCreatureTime;

        if (currentlyInChaos) {
            if (now.diff(currentChaosTime) < ms('3h')) {
                nextChaosGiantCreatureTime = currentChaosTime.add(ms('3h'));
            } else if (now.diff(currentChaosTime) < ms('6h')) {
                nextChaosGiantCreatureTime = currentChaosTime.add(ms('6h'));
            } else if (now.diff(currentChaosTime) < ms('9h')) {
                nextChaosGiantCreatureTime = currentChaosTime.add(ms('9h'));
            } else {
                nextChaosGiantCreatureTime = nextChaosTime;
            }
        } else {
            nextChaosGiantCreatureTime = nextChaosTime;
        }

        return message.channel.send(`👹 **Next Chaos Giant Creature respawn:** ${nextChaosGiantCreatureTime}`);
    },
};
