const ms = require('string-to-ms');

const { getCurrentChaosDatetime, getCurrentChaosGiantCreatureRespawnDatetimes, getNextChaosDatetime, getNextChaosGiantCreatureRespawnDatetimes } = require('../includes/chaos');
const moment = require("moment-timezone");

module.exports = {
    name: 'chaoses',
    description: 'Create countdown and reminder for Chaos start, and reminders for Chaos Giant Creature respawns',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        let now = moment().tz('Europe/London');
        let countdown = require(`../commands/countdown`);
        let remind = require(`../commands/remind`);
        let currentChaosTime = getCurrentChaosDatetime();
        let chaos;
        let chaosTime;
        let chaosGiantCreatureRespawnDatetimes;

        if ((now - currentChaosTime) < ms('2h')) {
            chaos = 'current';
            chaosTime = currentChaosTime;
            chaosGiantCreatureRespawnDatetimes = getCurrentChaosGiantCreatureRespawnDatetimes();
        } else {
            chaos = 'future';
            chaosTime = getNextChaosDatetime();
            chaosGiantCreatureRespawnDatetimes = getNextChaosGiantCreatureRespawnDatetimes();
        }

        return new Promise(async (resolve) => {
            if (chaos !== 'current') {
                await countdown.run(
                    client,
                    message,
                    [
                        'Chaos',
                        'starts',
                        '~',
                        'everyone',
                        '@',
                        ...chaosTime.format('DD-MM-YYYY HH:mm').split(' ')
                    ]
                )
                    .catch(console.error);
            }

            resolve();
        })
            .then(() => {
                chaosGiantCreatureRespawnDatetimes.forEach((respawnTime, index) => {
                    remind.run(
                        client,
                        message,
                        [
                            'Chaos',
                            'Giant',
                            'Creature',
                            (index === 0 ? 'spawns' : 'respawns'),
                            'in',
                            '5m',
                            '~',
                            'everyone',
                            '@',
                            ...respawnTime.clone().subtract(5, 'minutes').format('DD-MM-YYYY HH:mm').split(' ')
                        ]
                    );
                });
            });
    },
};
