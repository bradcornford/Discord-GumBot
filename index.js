require('dotenv').config()

const Discord = require('discord.js');

const client = new Discord.Client();

require('./includes/log');

const config = require('./includes/config');

client.commands = new Discord.Collection();

require('./handlers/command')(client);

client.on('ready', async () => {
    await require('./events/ready')(client);
});

client.on('message', async (message) => {
    await require('./events/message')(client, message);
});

client.on('messageReactionAdd', async (reaction, user) => {
    await require('./events/messageReactionAdd')(reaction, user);
});

client.login(config.discordToken)
    .catch(console.error);
