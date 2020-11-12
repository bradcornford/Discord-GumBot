const { getNextChaosGiantCreatureRespawnDatetime, getDurationRelativeToReset } = require('../includes/chaos');

module.exports = {
    name: 'creature',
    description: 'Display date and time of next Chaos Giant Creature respawn',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        let nextChaosGiantCreatureTime = getNextChaosGiantCreatureRespawnDatetime();

        return message.channel.send(`👹 **Next Chaos Giant Creature respawn:** ${nextChaosGiantCreatureTime} (Reset +${getDurationRelativeToReset(nextChaosGiantCreatureTime)})`);
    },
};
