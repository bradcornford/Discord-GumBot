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

    if (now.diff(currentChaosTime) < ms('3d')) {
        timefiledTwistedSpaceAttackTime = [5, currentChaosTime.add(ms('3d'))];
    } else if (now.diff(currentChaosTime) < ms('5d')) {
        timefiledTwistedSpaceAttackTime = [4, currentChaosTime.add(ms('5d'))];
    } else if (now.diff(currentChaosTime) < ms('7d')) {
        timefiledTwistedSpaceAttackTime = [3, currentChaosTime.add(ms('7d'))];
    } else if (now.diff(currentChaosTime) < ms('9d')) {
        timefiledTwistedSpaceAttackTime = [2, currentChaosTime.add(ms('9d'))];
    } else if (now.diff(currentChaosTime) < ms('11d')) {
        timefiledTwistedSpaceAttackTime = [1, currentChaosTime.add(ms('11d'))];
    } else {
        timefiledTwistedSpaceAttackTime = [0, 'Now'];
    }

    return timefiledTwistedSpaceAttackTime;
}

const getNextTimefieldTwistedSpaceAttackDatetimes = () => {
    let nextTimefieldTime = getNextTimefieldDatetime();

    return [
        [5, nextTimefieldTime.clone().add(ms('3d'))],
        [4, nextTimefieldTime.clone().add(ms('5d'))],
        [3, nextTimefieldTime.clone().add(ms('7d'))],
        [2, nextTimefieldTime.clone().add(ms('9d'))],
        [1, nextTimefieldTime.clone().add(ms('11d'))],
    ];
}

exports.getNextTimefieldDatetime = getNextTimefieldDatetime;
exports.getDurationToReset = getDurationToReset;
exports.getCurrentTimefieldDatetime = getCurrentTimefieldDatetime;
exports.getCurrentTimefieldTwistedSpaceAttackDatetime = getCurrentTimefieldTwistedSpaceAttackDatetime;
exports.getNextTimefieldTwistedSpaceAttackDatetimes = getNextTimefieldTwistedSpaceAttackDatetimes;
