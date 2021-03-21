const config = require('../includes/config');

/**
 * @param {GuildMember} member
 */
module.exports = async (member) => {
    console.log(`New User "${member.user.username}" has joined "${member.guild.name}"`);

    let role = member.guild.roles.cache.find(role => role.name === config.discordDefaultRole);
    let readme = member.guild.channels.cache.find(channel => channel.name === config.discordReadmeChannel)

    member.roles.add(role).catch(console.error);
    console.log(`User "${member.user.username}" assigned the role "${role.name}"`);

    member.user.send(`Howdy <@${member.user.id}>, and welcome to the ${member.guild.name} server.
You've been assigned the **@${config.discordDefaultRole}** role.
If you're applying to the alliance the consul will set suitable privileges soon. 
Please be sure to check the <#${readme.id}> and poke around! Any questions just ask.`)
        .catch(console.error);
    console.log(`User "${member.user.username}" has been sent the guild welcome message`);
};
