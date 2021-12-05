const { MessageEmbed } = require('discord.js');

const { readdirSync } = require('fs');

const config = require('../includes/config');

module.exports = {
    name: 'help',
    description: 'Show help for the bot',
    parameters: [],
    hidden: true,
    run: async (client, message, args) => {
        let count = readdirSync(`./commands/`).length;
        let embeds = [];
        let i = 1;
        let embed;

        readdirSync(`./commands/`).map((cmd) => {
            let command = require(`../commands/${cmd}`);

            if (i === 1 || i % 25 === 0) {
                embed = new MessageEmbed()
                    .setColor(config.colors.info)
                    .setTitle((i === 1 ? ' Help' : ''))
                    .setDescription((i === 1 ? 'Available commands' : ''))
                    .setFooter((i >= (Math.floor(count / 25) * 25) ? `Gum Bot ${config.version}` : ''))
                    .setTimestamp();
            }

            if (!command.hidden) {
                embed.addField(`**\`${config.prefix}${command.name} ${command.parameters.join(' ')}\`**`, command.description);
            }

            if (i % 24 === 0 || i === count) {
                embeds.push(embed);
            }

            i++;
        });

        return embeds.forEach((embed) => {
            return message.author.send(embed)
        });
    },
};
