const { MessageEmbed } = require('discord.js');

const moment = require('moment-timezone');

const config = require('../includes/config');

module.exports = {
    name: 'time',
    description: 'Display a list of current times',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        let now = moment();
        let gameTime = now.clone().tz('Asia/Shanghai');

        const embed = new MessageEmbed()
            .setColor(config.colors.primary)
            .setTitle('🕰️ **Times:**')
            .setDescription('Times across the world')
            .addFields(
                {
                    name: 'Game',
                    value: gameTime.format('hh:mm A'),
                    inline: true,
                },
                {
                    name: 'California',
                    value: gameTime.clone().tz('America/Los_Angeles').format('hh:mm A'),
                    inline: true,
                },
                {
                    name: 'New York',
                    value: gameTime.clone().tz('America/New_York').format('hh:mm A'),
                    inline: true,
                },
                {
                    name: 'London',
                    value: gameTime.clone().tz('Europe/London').format('hh:mm A'),
                    inline: true,
                },
                {
                    name: 'Berlin',
                    value: gameTime.clone().tz('Europe/Berlin').format('hh:mm A'),
                    inline: true,
                },
                {
                    name: 'India',
                    value: gameTime.clone().tz('Asia/Colombo').format('hh:mm A'),
                    inline: true,
                },
                {
                    name: 'Sydney',
                    value: gameTime.clone().tz('Australia/Sydney').format('hh:mm A'),
                    inline: true,
                },
                {
                    name: 'China',
                    value: gameTime.clone().tz('Asia/Shanghai').format('hh:mm A'),
                    inline: true,
                },
                {
                    name: 'Tokyo',
                    value: gameTime.clone().tz('Asia/Tokyo').format('hh:mm A'),
                    inline: true,
                }
            )
            .setFooter(`Gum Bot ${config.version}`)
            .setTimestamp();

        return message.channel.send(embed);
    },
};
