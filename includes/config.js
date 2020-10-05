const ms = require('ms');

const PREFIX = process.env.BOT_PREFIX || '!';
const DISCORD_TOKEN = process.env.DISCORD_TOKEN || '';
const DISCORD_CODES_CHANNEL = process.env.DISCORD_CODES_CHANNEL || 'codes';
const DISCORD_UPDATES_CHANNEL = process.env.DISCORD_UPDATES_CHANNEL || 'announcements';
const POLL_INTERVAL = ms(process.env.POLL_INTERVAL) || ms('1h');
const CODES = [];
const UPDATES = [];

exports.prefix = PREFIX;
exports.discordToken = DISCORD_TOKEN;
exports.discordCodesChannel = DISCORD_CODES_CHANNEL;
exports.discordUpdatesChannel = DISCORD_UPDATES_CHANNEL;
exports.pollInterval = POLL_INTERVAL;
exports.codes = CODES;
exports.updates = UPDATES;
