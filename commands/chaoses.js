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

        return countdown.run(
            client,
            message,
            [
                'Chaos',
                'starts',
                '~',
                'everyone',
                '@',
                ...nextChaosTime.format('DD-MM-YYYY HH:mm').split(' ')
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
                        ...nextChaosTime.clone().subtract(10, 'minutes').format('DD-MM-YYYY HH:mm').split(' ')
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
                            ...respawnTime.clone().subtract(5, 'minutes').format('DD-MM-YYYY HH:mm').split(' ')
                        ]
                    );
                });
            });
    },
};
