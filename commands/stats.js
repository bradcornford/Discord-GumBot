const { MessageEmbed, version: discordVersion } = require('discord.js');

const moment = require('moment-timezone');

const packageJson = require('../package.json');

const { loadavg, cpus } = require('os');
const { version: nodeVersion } = require('process');

const toMB = num => num / 1024 / 1024;
const to2Decimals = num => Math.round(num * 100) / 100;

module.exports = {
    name: 'stats',
    description: 'Show statistics for the bot',
    parameters: [],
    hidden: false,
    run: async (client, message, args) => {
        let now = moment();

        const memoryUsage = process.memoryUsage();
        const memoryTotal = Math.round(toMB(memoryUsage.heapTotal));
        const memoryUsed = to2Decimals(toMB(memoryUsage.heapUsed));
        const osLoad = Math.round((loadavg()[0] / cpus().length) * 1e4) / 100;
        const upTime = now.subtract(client.uptime).fromNow(true);

        const embed = new MessageEmbed()
            .setColor(0x17A2B8)
            .setTitle('Statistics')
            .setDescription('System statistics')
            .addFields(
                {
                    name: '🔥 CPU usage',
                    value: `**${osLoad}%**`,
                    inline: true,
                },
                {
                    name: '🎚️ Memory',
                    value: `**${memoryUsed}/${memoryTotal}M**`,
                    inline: true,
                },
                {
                    name: '⏲️ Uptime',
                    value: `**${upTime}**`,
                    inline: true,
                },
                {
                    name: '🔴 Latency',
                    value: `**${client.ws.ping}ms**`,
                    inline: true,
                },
                {
                    name: '📨 Discord.js',
                    value: `**v${discordVersion}**`,
                    inline: true,
                },
                {
                    name: '✅ Node.js',
                    value: `**${nodeVersion}**`,
                    inline: true,
                }
            )
            .setFooter(`Gum Bot ${packageJson.version}`)
            .setTimestamp();

        return message.channel.send(embed);
    },
};
