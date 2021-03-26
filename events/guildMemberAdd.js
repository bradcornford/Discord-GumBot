const config = require('../includes/config');

/**
 * @param {GuildMember} member
 */
module.exports = async (member) => {
    console.log(`New User "${member.user.username}" has joined "${member.guild.name}"`);
    let role = '';
    let readme = '';

    if (config.discordDefaultRole !== '') {
        role = member.guild.roles.cache.find(role => role.name === config.discordDefaultRole);

        if (role) {
            member.roles.add(role).catch(console.error);
            console.log(`User "${member.user.username}" assigned the role "${role.name}"`);
        } else {
            console.error(`Unable to find the role assigned the role "${config.discordDefaultRole}"`);
        }
    }

    if (config.discordWelcomeMessage !== '') {
        if (config.discordReadmeChannel !== '') {
            readme = member.guild.channels.cache.find(channel => channel.name === config.discordReadmeChannel);

            if (!readme) {
                console.error(`Unable to find the readme channel "${config.discordReadmeChannel}"`);
            }
        }

        let message = config.discordWelcomeMessage
            .replace('%USER%', `<@${member.user.id}>`)
            .replace('%GUILD%', `${member.guild.name}`)
            .replace('%ROLE%', (role ? `**@${role.name}**` : ''))
            .replace('%README%', (readme ? `<#${readme.id}>` : ''));

        if (config.discordWelcomeChannel !== 'false') {
            let channel = member.guild.channels.cache.find(channel => channel.name === config.discordWelcomeChannel);

            if (channel) {
                channel.send(message)
                    .catch(console.error);
                console.log(`Welcomed user "${member.user.username}" in guild welcome channel "${channel.name}"`);
            } else {
                console.error(`Unable to find welcome channel "${config.discordWelcomeChannel}"`);
            }
        } else {
            member.user.send(message)
                .catch(console.error);
            console.log(`User "${member.user.username}" has been sent the guild welcome message`);
        }
    }
};
