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
    let currentTimefieldTime = getCurrentTimefieldDatetime();

    if (now.diff(currentTimefieldTime) < ms('4d')) {
        timefiledTwistedSpaceAttackTime = [4, currentTimefieldTime.add(ms('4d'))];
    } else if (now.diff(currentTimefieldTime) < ms('6d')) {
        timefiledTwistedSpaceAttackTime = [3, currentTimefieldTime.add(ms('6d'))];
    } else if (now.diff(currentTimefieldTime) < ms('8d')) {
        timefiledTwistedSpaceAttackTime = [2, currentTimefieldTime.add(ms('8d'))];
    } else if (now.diff(currentTimefieldTime) < ms('1.d')) {
        timefiledTwistedSpaceAttackTime = [1, currentTimefieldTime.add(ms('10d'))];
    } else {
        timefiledTwistedSpaceAttackTime = [0, 'Now'];
    }

    return timefiledTwistedSpaceAttackTime;
}

const getCurrentTimefieldTwistedSpaceAttackDatetimes = () => {
    let currentTimefieldTime = getCurrentTimefieldDatetime();

    return [
        [4, currentTimefieldTime.clone().add(ms('4d'))],
        [3, currentTimefieldTime.clone().add(ms('6d'))],
        [2, currentTimefieldTime.clone().add(ms('8d'))],
        [1, currentTimefieldTime.clone().add(ms('10d'))],
    ];
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
exports.getCurrentTimefieldTwistedSpaceAttackDatetimes = getCurrentTimefieldTwistedSpaceAttackDatetimes;
exports.getNextTimefieldTwistedSpaceAttackDatetimes = getNextTimefieldTwistedSpaceAttackDatetimes;
