const ms = require('string-to-ms');

const { getNextChaosDatetime, getNextChaosGiantCreatureRespawnDatetimes } = require('../includes/chaos');

module.exports = {
    name: 'chaoses',
    description: 'Create countdown and reminder for Chaos start, and reminders for Chaos Giant Creature respawns',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        let countdown = require(`../commands/countdown`);
        let remind = require(`../commands/remind`);
        let nextChaosTime = getNextChaosDatetime();
        let nextChaosGiantCreatureRespawnTimes = getNextChaosGiantCreatureRespawnDatetimes();

        // Chaos countdown
        return countdown.run(
            client,
            message,
            [
                'Chaos',
                'starts',
                '~',
                'everyone',
                '@',
                nextChaosTime.format('DD-MM-YYYY hh:mm')
            ]
        )
            .then(() => {
                remind.run(
                    client,
                    message,
                    [
                        'Chaos',
                        'starting',
                        'in',
                        '10m',
                        '~',
                        'everyone',
                        '@',
                        nextChaosTime.clone().subtract(ms('10m')).format('DD-MM-YYYY hh:mm')
                    ]
                );
            })
            .then(() => {
                nextChaosGiantCreatureRespawnTimes.forEach((respawnTime, index) => {
                    remind.run(
                        client,
                        message,
                        [
                            'Chaos',
                            'Giant',
                            'Create',
                            (index === 0 ? 'spawns' : 'respawns'),
                            'in',
                            '5m',
                            '~',
                            'everyone',
                            '@',
                            respawnTime.clone().subtract(ms('5m')).format('DD-MM-YYYY hh:mm')
                        ]
                    );
                });
            });
    },
};
