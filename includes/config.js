const ms = require('string-to-ms');
const packageJson = require('../package.json');

const PREFIX = process.env.BOT_PREFIX || '!';
const DISCORD_TOKEN = process.env.DISCORD_TOKEN || '';
const DISCORD_WELCOME_CHANNEL = process.env.DISCORD_WELCOME_CHANNEL || 'welcome';
const DISCORD_DEFAULT_ROLE = process.env.DISCORD_DEFAULT_ROLE || 'guest';
const DISCORD_CODES_CHANNEL = process.env.DISCORD_CODES_CHANNEL || 'codes';
const DISCORD_UPDATES_CHANNEL = process.env.DISCORD_UPDATES_CHANNEL || 'announcements';
const POLL_INTERVAL = ms(process.env.POLL_INTERVAL) || ms('1h');
const CODES = [];
const UPDATES = [];
const COLORS = {
    primary: '#004085',
    secondary: '#383d41',
    success: '#155724',
    danger: '#721c24',
    warning: '#856404',
    info: '#0c5460',
    light: '#818182',
    dark: '#1b1e21',
};

exports.prefix = PREFIX;
exports.discordToken = DISCORD_TOKEN;
exports.discordWelcomeChannel = DISCORD_WELCOME_CHANNEL;
exports.discordDefaultRole = DISCORD_DEFAULT_ROLE;
exports.discordCodesChannel = DISCORD_CODES_CHANNEL;
exports.discordUpdatesChannel = DISCORD_UPDATES_CHANNEL;
exports.pollInterval = POLL_INTERVAL;
exports.codes = CODES;
exports.updates = UPDATES;
exports.colors = COLORS;
exports.version = packageJson.version;
