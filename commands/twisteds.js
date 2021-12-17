const ms = require('string-to-ms');

const { getCurrentTimefieldDatetime, getCurrentTimefieldTwistedSpaceAttackDatetimes, getNextTimefieldDatetime, getNextTimefieldTwistedSpaceAttackDatetimes } = require('../includes/timefield');
const moment = require("moment-timezone");

module.exports = {
    name: 'twisteds',
    description: 'Create countdown and reminder for Timefield start, and reminders for Twisted Space attacks',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        let now = moment().tz('Europe/London');
        let countdown = require(`../commands/countdown`);
        let remind = require(`../commands/remind`);
        let currentTimefieldTime = getCurrentTimefieldDatetime();
        let timefield;
        let timefieldTime;
        let timefieldTwistedSpaceAttackTimes;

        if ((now - currentTimefieldTime) < ms('3d')) {
            timefield = 'current';
            timefieldTime = currentTimefieldTime;
            timefieldTwistedSpaceAttackTimes = getCurrentTimefieldTwistedSpaceAttackDatetimes();
        } else {
            timefield = 'future';
            timefieldTime = getNextTimefieldDatetime();
            timefieldTwistedSpaceAttackTimes = getNextTimefieldTwistedSpaceAttackDatetimes();
        }

        return new Promise(async (resolve) => {
            if (timefield !== 'current') {
                await countdown.run(
                    client,
                    message,
                    [
                        'Timefield',
                        'resets',
                        '~',
                        'everyone',
                        '@',
                        ...timefieldTime.format('DD-MM-YYYY HH:mm').split(' ')
                    ]
                )
                    .catch(console.error);
            }

            resolve();
        })
            .then(() => {
                timefieldTwistedSpaceAttackTimes.forEach((timefieldTwistedSpaceAttack, index) => {
                    let [page, timefieldTwistedSpaceAttackTime] = timefieldTwistedSpaceAttack

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
                            ...timefieldTwistedSpaceAttackTime.clone().format('DD-MM-YYYY HH:mm').split(' ')
                        ]
                    );
                });
            });
    },
};
