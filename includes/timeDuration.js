const STRINGS = {
    long: {
        lessThanAMinute: 'less than a minute',
        minute: 'minute',
        hour: 'hour',
        day: 'day',
        week: 'week',
    },
    short: {
        lessThanAMinute: '< 1m',
        minute: 'm',
        hour: 'h',
        day: 'd',
        week: 'w',
    }
};

const TIME_SECOND = 1000;
const TIME_MINUTE = (TIME_SECOND * 60);
const TIME_HOUR = (TIME_MINUTE * 60);
const TIME_DAY = (TIME_HOUR * 24);
const TIME_WEEK = (TIME_DAY * 7);

const timeDuration = (time, short= false, useWeeks = true) => {
    let strings = (short ? STRINGS.short : STRINGS.long);

    if (time < TIME_MINUTE) {
        return strings.lessThanAMinute;
    }

    const weeks = Math.floor(time / TIME_WEEK);
    const days = Math.floor((useWeeks ? (time % TIME_WEEK) : time) / TIME_DAY);
    const hours = Math.floor((time % TIME_DAY) / TIME_HOUR);
    const minutes = Math.floor((time % TIME_HOUR) / TIME_MINUTE);

    let string = '';

    if (useWeeks && weeks) {
        string = `${weeks}${!short ? ' ' : ''}${strings.week}${!short && weeks > 1 ? 's' : ''} `;
    }

    if (days) {
        string += `${days}${!short ? ' ' : ''}${strings.day}${!short && days > 1 ? 's' : ''} `;
    }

    if (hours) {
        string += `${hours}${!short ? ' ' : ''}${strings.hour}${!short && hours > 1 ? 's' : ''} `;
    }

    if (minutes) {
        string += `${minutes}${!short ? ' ' : ''}${strings.minute}${!short && minutes > 1 ? 's' : ''} `;
    }

    let remaining = string.trim().split(' ');

    if (!short) {
        if (remaining.length > 7) {
            remaining[3] += ',';
        }

        if (remaining.length > 5) {
            remaining[1] += ',';
        }

        if (remaining.length > 2) {
            remaining.splice(-2, 0, 'and');
        }
    }

    return remaining.join(' ');
}

exports.timeDuration = timeDuration;
