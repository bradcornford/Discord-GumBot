const config = require('../includes/config');

/**
 * @param {GuildMember} member
 */
module.exports = async (member) => {
    console.log(`New User "${member.user.username}" has joined "${member.guild.name}"`);

    let channel = member.guild.channels.cache.find(channel => channel.name === config.discordWelcomeChannel);
    let role = member.guild.roles.cache.find(role => role.name === config.discordDefaultRole);

    member.roles.add(role).catch(console.error);

    channel.send(`Howdy <@${member.user.id}>, and welcome to the ${member.guild.name} server.
You've been assigned the **@${config.discordDefaultRole}** role.
If you're applying to the alliance the consul will set suitable privileges soon. 
Please be sure to check the <#${member.guild.channels.cache.find(channel => channel.name === 'read-me').id}> and poke around! Any questions just ask.`)
        .catch(console.error);
};
