const moment = require('moment-timezone');

const ms = require('string-to-ms');

const initialChaosStartTime = moment('10-10-2020 13:00:00', 'DD-MM-YYYY hh:mm:ss').tz('Europe/London');
const chaosInterval = ms('14d 2h');
const chaosPeriod = ms('12h');
const chaosAlternatingDifference = ms('1d 4h');

const getNextChaosDatetime = () => {
    let now = moment().tz('Europe/London');
    let chaosCount = Math.ceil(now.diff(initialChaosStartTime) / ms('14d'));

    return initialChaosStartTime.clone().add(
        (chaosInterval * chaosCount) +
        (chaosPeriod * chaosCount) -
        (Math.floor(chaosCount / 2) * chaosAlternatingDifference)
    );
}

const getCurrentChaosDatetime = () => {
    let now = moment().tz('Europe/London');
    let chaosCount = Math.ceil(now.diff(initialChaosStartTime) / ms('14d')) - 1;

    return initialChaosStartTime.clone().add(
        (chaosInterval * chaosCount) +
        (chaosPeriod * chaosCount) -
        (Math.floor(chaosCount / 2) * chaosAlternatingDifference)
    );
}

const currentlyInChaosPeriod = () => {
    let now = moment().tz('Europe/London');

    return (now === getCurrentChaosDatetime() || ((now.diff(initialChaosStartTime) % ms('14d')) < chaosPeriod));
}

exports.getNextChaosDatetime = getNextChaosDatetime;
exports.currentlyInChaosPeriod = currentlyInChaosPeriod;
exports.getCurrentChaosDatetime = getCurrentChaosDatetime;
