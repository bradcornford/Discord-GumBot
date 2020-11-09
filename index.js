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

client.on('messageUpdate', async (oldMessage, newMessage) => {
    await require('./events/messageUpdate')(oldMessage, newMessage);
});

client.on('messageDelete', async (message) => {
    await require('./events/messageDelete')(message);
});

client.on('messageReactionAdd', async (reaction, user) => {
    await require('./events/messageReactionAdd')(reaction, user);
});

client.on('messageReactionRemove', async (reaction, user) => {
    await require('./events/messageReactionRemove')(reaction, user);
});

client.on('guildMemberAdd', async (member) => {
    await require('./events/guildMemberAdd')(member);
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    await require('./events/guildMemberUpdate')(oldMember, newMember);
});

client.on('guildMemberRemove', async (member) => {
    await require('./events/guildMemberRemove')(member);
});

client.login(config.discordToken)
    .catch(console.error);
