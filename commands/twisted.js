const { getCurrentTimefieldTwistedSpaceAttackDatetime } = require('../includes/timefield');

module.exports = {
    name: 'twisted',
    description: 'Display date and time of next Timefield Twisted Space attack',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        let [page, currentTimefieldTwistedSpaceAttackDatetime] = getCurrentTimefieldTwistedSpaceAttackDatetime();

        if (page === 0) {
            pages = 'All pages';
        } else if(page === 5) {
            pages = `Page ${page}`;
        } else {
            pages = `Pages ${page}-5`;
        }

        return message.channel.send(`👾 **Next Timefield Twisted Space attack:** ${pages} @ ${currentTimefieldTwistedSpaceAttackDatetime}`);
    },
};
