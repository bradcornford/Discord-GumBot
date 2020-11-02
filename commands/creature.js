const ms = require('string-to-ms');

const { getNextChaosDatetime, currentlyInChaosPeriod, getCurrentChaosDatetime } = require('../includes/chaos');

module.exports = {
    name: 'creature',
    description: 'Display date and time of next Chaos Giant Creature respawn',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        let currentlyInChaos = currentlyInChaosPeriod();
        let nextChaosTime = getNextChaosDatetime();
        let nextChaosGiantCreatureTime;

        if (currentlyInChaos) {
            let currentChaosTime = getCurrentChaosDatetime();

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
