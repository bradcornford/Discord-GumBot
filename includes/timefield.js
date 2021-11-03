const moment = require('moment-timezone');

const ms = require('string-to-ms');
const { timeDuration } = require('./timeDuration');

const initialTimefieldStartTime = moment('26-08-2021 17:00:00', 'DD-MM-YYYY hh:mm:ss').tz('Europe/London');
const timefieldPeriod = ms('14d');

const getNextTimefieldDatetime = () => {
    let now = moment().tz('Europe/London');
    let countDays = (now.diff(initialTimefieldStartTime) / ms('1d'));
    let timefieldCount = Math.ceil(countDays / 14);

    return initialTimefieldStartTime.clone()
        .add((timefieldPeriod * timefieldCount));
}

const getDurationToReset = (time) => {
    let now = moment().tz('Europe/London');

    return timeDuration((time.subtract(now)), true);
}

const getCurrentTimefieldDatetime = () => {
    let now = moment().tz('Europe/London');
    let timefieldCount = Math.ceil(now.diff(initialTimefieldStartTime) / ms('14d')) - 1;

    return initialTimefieldStartTime.clone()
        .add((timefieldPeriod * timefieldCount));
}

const getCurrentTimefieldTwistedSpaceAttackDatetime = () => {
    let now = moment().tz('Europe/London');
    let currentChaosTime = getCurrentTimefieldDatetime();

    if (now.diff(currentChaosTime) < ms('4d')) {
        timefiledTwistedSpaceAttackTime = [4, currentChaosTime.add(ms('4d'))];
    } else if (now.diff(currentChaosTime) < ms('6d')) {
        timefiledTwistedSpaceAttackTime = [3, currentChaosTime.add(ms('6d'))];
    } else if (now.diff(currentChaosTime) < ms('8d')) {
        timefiledTwistedSpaceAttackTime = [2, currentChaosTime.add(ms('8d'))];
    } else if (now.diff(currentChaosTime) < ms('1.d')) {
        timefiledTwistedSpaceAttackTime = [1, currentChaosTime.add(ms('10d'))];
    } else {
        timefiledTwistedSpaceAttackTime = [0, 'Now'];
    }

    return timefiledTwistedSpaceAttackTime;
}

const getNextTimefieldTwistedSpaceAttackDatetimes = () => {
    let nextTimefieldTime = getNextTimefieldDatetime();

    return [
        [4, nextTimefieldTime.clone().add(ms('4d'))],
        [3, nextTimefieldTime.clone().add(ms('6d'))],
        [2, nextTimefieldTime.clone().add(ms('8d'))],
        [1, nextTimefieldTime.clone().add(ms('10d'))],
    ];
}

exports.getNextTimefieldDatetime = getNextTimefieldDatetime;
exports.getDurationToReset = getDurationToReset;
exports.getCurrentTimefieldDatetime = getCurrentTimefieldDatetime;
exports.getCurrentTimefieldTwistedSpaceAttackDatetime = getCurrentTimefieldTwistedSpaceAttackDatetime;
exports.getNextTimefieldTwistedSpaceAttackDatetimes = getNextTimefieldTwistedSpaceAttackDatetimes;
