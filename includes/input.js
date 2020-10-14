const moment = require('moment-timezone');

const ms = require('string-to-ms');

const validateMessageFromInput = (args, message) => {
    if (args.length === 0 || typeof args[0] !== 'string') {
        message.reply(`You didn\'t specify all of the required arguments!`);

        return false;
    }

    return true;
}

const validateUserFromInput = (args, message) => {
    if (args.indexOf('~') === -1) {
        message.reply(`You didn\'t specify the reminder user or group!`);

        return false;
    }

    return true;
}

const validateTimeFromInput = (args, message) => {
    if (args.indexOf('@') === -1) {
        message.reply(`You didn\'t specify a date and time for the command!`);

        return false;
    }

    let input = args.slice((args.indexOf('@') + 1), args.length).join(' ');
    let time;

    if (input.includes('-')) {
        if (!/^[0-9]{2}-[0-9]{2}-[0-9]{4} [0-9]{2}:[0-9]{2}$/.test(input)) {
            message.reply(`You didn\'t specify the date and time in a valid format!`);

            return false;
        }

        time = moment(input, 'DD-MM-YYYY hh:mm');
    } else if (input.includes(':')) {
        if (!/^[0-9]{2}:[0-9]{2}$/.test(input)) {
            message.reply(`You didn\'t specify the date and time in a valid format!`);

            return false;
        }

        time = moment(input, 'hh:mm');
    } else if (/[dhm]/.test(input)) {
        if (!/^([0-9]+[dhms]\s?)+$/.test(input)) {
            message.reply(`You didn\'t specify the time in a valid format!`);

            return false;
        }

        time = moment().add(ms(input));
    } else {
        message.reply(`You didn\'t specify the date time in a valid format!`);

        return false;
    }

    if (time.diff(moment()) <= 0) {
        message.reply(`Date time occurs in the past!`);

        return false;
    }

    return time;
}

const extractMessageFromInput = (args) => {
    let end;

    if (args.indexOf('~') !== -1) {
        end = args.indexOf('~');
    } else if (args.indexOf('@') !== -1) {
        end = args.indexOf('@');
    } else {
        end = args.length;
    }

    return args.slice(0, end).join(' ');
}

const extractUserFromInput = (args) => {
    let end;

    if (args.indexOf('@') !== -1) {
        end = args.indexOf('@');
    } else {
        end = args.length;
    }

    return args.slice((args.indexOf('~') + 1), end).join(' ');
}

const extractTimeFromInput = (args) => {
    let input = args.slice((args.indexOf('@') + 1), args.length).join(' ');

    if (input.includes('-')) {
        return moment(input, 'DD-MM-YYYY hh:mm');
    } else if (input.includes(':')) {
        return moment(input, 'hh:mm');
    } else if (/[dhm]/.test(input)) {
        return moment().add(ms(input));
    }

    return moment();
}

exports.validateMessageFromInput = validateMessageFromInput;
exports.validateUserFromInput = validateUserFromInput;
exports.validateTimeFromInput = validateTimeFromInput;
exports.extractMessageFromInput = extractMessageFromInput;
exports.extractUserFromInput = extractUserFromInput;
exports.extractTimeFromInput = extractTimeFromInput;
