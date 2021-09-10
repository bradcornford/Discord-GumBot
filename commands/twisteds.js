const { getNextTimefieldDatetime, getNextTimefieldTwistedSpaceAttackDatetimes } = require('../includes/timefield');

module.exports = {
    name: 'twisteds',
    description: 'Create countdown and reminder for Timefield start, and reminders for Twisted Space attacks',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        let countdown = require(`../commands/countdown`);
        let remind = require(`../commands/remind`);
        let nextTimefiledTime = getNextTimefieldDatetime();
        let nextTimefieldTwistedSpaceAttackTimes = getNextTimefieldTwistedSpaceAttackDatetimes();

        return countdown.run(
            client,
            message,
            [
                'Timefield',
                'resets',
                '~',
                'everyone',
                '@',
                ...nextTimefiledTime.format('DD-MM-YYYY HH:mm').split(' ')
            ]
        )
            .then(() => {
                nextTimefieldTwistedSpaceAttackTimes.forEach((nextTimefieldTwistedSpaceAttack, index) => {
                    let [page, nextTimefieldTwistedSpaceAttackTime] = nextTimefieldTwistedSpaceAttack

                    if (page <= 1) {
                        pages = ['All pages'];
                    } else if(page === 5) {
                        pages = ['Page', page];
                    } else {
                        pages = ['Pages', `${page}-5`];
                    }

                    remind.run(
                        client,
                        message,
                        [
                            ...pages,
                            'can',
                            'attack',
                            'twisted',
                            'space',
                            '~',
                            'everyone',
                            '@',
                            ...nextTimefieldTwistedSpaceAttackTime.clone().format('DD-MM-YYYY HH:mm').split(' ')
                        ]
                    );
                });
            });
    },
};
