const moment = require('moment-timezone');

const ms = require('string-to-ms');
const { timeDuration } = require("./timeDuration");

const initialChaosStartTime = moment('10-10-2020 13:00:00', 'DD-MM-YYYY hh:mm:ss').tz('Europe/London');
const chaosInterval = ms('14d 2h');
const chaosPeriod = ms('12h');
const chaosAlternatingDifference = ms('1d 4h');

const getNextChaosDatetime = () => {
    let now = moment().tz('Europe/London');
    let countDays = now.diff(initialChaosStartTime) / ms('1d');
    let countRotations = countDays / 28;
    let chaosCount = Math.ceil(countRotations + Math.floor(countRotations)) + (countRotations >= 14.583333333333336 ? 1 : 0);

    return initialChaosStartTime.clone().add(
        (chaosInterval * chaosCount) +
        (chaosPeriod * chaosCount) -
        (Math.floor(chaosCount / 2) * chaosAlternatingDifference)
    );
}

const getDurationRelativeToReset = (time) => {
    let gameResetTime = time.tz('Asia/Shanghai').clone().startOf('day');

    return timeDuration((time.subtract(gameResetTime)), true);
}

const getNextChaosGiantCreatureRespawnDatetime = () => {
    let currentlyInChaos = currentlyInChaosPeriod();
    let nextChaosTime = getNextChaosDatetime();
    let nextChaosGiantCreatureTime;

    if (currentlyInChaos) {
        let currentChaosTime = getCurrentChaosDatetime();

        if (now.diff(currentChaosTime) < ms('3h')) {
            nextChaosGiantCreatureTime = currentChaosTime.add(ms('3h'));
        } else if (now.diff(currentChaosTime) < ms('6h')) {
            nextChaosGiantCreatureTime = currentChaosTime.add(ms('6h'));
        } else if (now.diff(currentChaosTime) < ms('9h')) {
            nextChaosGiantCreatureTime = currentChaosTime.add(ms('9h'));
        } else {
            nextChaosGiantCreatureTime = nextChaosTime;
        }
    } else {
        nextChaosGiantCreatureTime = nextChaosTime;
    }

    return nextChaosGiantCreatureTime;
}

const getNextChaosGiantCreatureRespawnDatetimes = () => {
    let nextChaosTime = getNextChaosDatetime();

    return [
        nextChaosTime,
        nextChaosTime.clone().add(ms('3h')),
        nextChaosTime.clone().add(ms('6h')),
        nextChaosTime.clone().add(ms('9h'))
    ];
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
exports.getDurationRelativeToReset = getDurationRelativeToReset;
exports.currentlyInChaosPeriod = currentlyInChaosPeriod;
exports.getCurrentChaosDatetime = getCurrentChaosDatetime;
exports.getNextChaosGiantCreatureRespawnDatetime = getNextChaosGiantCreatureRespawnDatetime;
exports.getNextChaosGiantCreatureRespawnDatetimes = getNextChaosGiantCreatureRespawnDatetimes;
