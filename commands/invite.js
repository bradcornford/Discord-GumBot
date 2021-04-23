const { MessageEmbed, Collection } = require('discord.js');

const moment = require('moment-timezone');

const ms = require('string-to-ms');

const config = require('../includes/config');

const { getUsernameForGuild } = require("../includes/discord");

const { validateMessageFromInput, validateTimeFromInput, extractMessageFromInput, extractOptionsFromInput, extractTimeFromInput } = require('../includes/input');

const { timeDuration } = require('../includes/timeDuration');

module.exports = {
    name: 'invite',
    description: 'Create an invite to an event',
    parameters: [
        'Event Name',
        '{', '✅', '|', '❓', '|', '❌', '|' , '...', '}',
        '@',
        '[', 'dd-mm-yyyy hh:mm', '|', 'hh:mm' , '|' , '1d 1h 1m', ']',
    ],
    hidden: false,
    run: async (client, message, args) => {
        if (!validateMessageFromInput(args, message) || !validateTimeFromInput(args, message)) {
            return message;
        }

        let now = moment();
        const initialMessage = message;
        let inviteTime = extractTimeFromInput(args);
        let inviteMessage;
        let inviteName = extractMessageFromInput(args);
        let inviteOptions = extractOptionsFromInput(args);

        if (inviteOptions.length === 0) {
            inviteOptions = ['✅', '❓', '❌'];
        }

        const reactedUsers = new Collection();
        const options = {};

        inviteOptions.forEach((pollOption) => {
            options[pollOption] = new Collection();
        });

        let panels = () => {
            let fields = [];

            inviteOptions.forEach((inviteOption, index) => {
                fields.push({
                    name: '[' + inviteOption + ']',
                    value: (options[inviteOption].size === 0 ? '-' : options[inviteOption].map((username) => { return username; }).join(`\n`)),
                    inline: true,
                });
            });

            return fields;
        };

        let embed = () => {
            return new MessageEmbed()
                .setColor(config.colors.primary)
                .setTitle(inviteName)
                .setDescription(inviteTime)
                .addFields(...panels())
                .setAuthor(`Created by ${message.author.username}`)
                .setFooter(inviteTime.diff(moment()) <= 0 ? 'Occurred' : `Occurs in ${timeDuration(inviteTime.diff(moment()))}`)
                .setTimestamp();
        };

        message.author.send(`✉️ **Created invite:** ${inviteName} @ ${inviteTime}`)
            .catch(console.error);

        return message.channel.send(embed())
            .then(message => {
                inviteMessage = message;
                console.log(`User ${initialMessage.author.username} created 'invite': ${inviteName} @ ${inviteTime}`);

                let promises = [];

                inviteOptions.forEach((inviteOption) => {
                    promises.push(message.react(inviteOption));
                });

                Promise.all(promises)
                    .then(() => {
                        const filter = (reaction, user) => {
                            if (!inviteOptions.includes(reaction.emoji.name)) {
                                reaction.users.reaction.users.remove(user.id)
                                    .then(() => console.log(`Deleted unrecognised 'invite' reaction from ${user.username}`))
                                    .catch(console.error);

                                return false;
                            }

                            if (reactedUsers.get(user.id)) {
                                reaction.users.reaction.users.remove(user.id)
                                    .then(() => console.log(`Deleted multiple 'invite' reaction from ${user.username}`))
                                    .catch(console.error);

                                return false;
                            }

                            console.log(`Recognised 'invite' reaction '${reaction.emoji.name}' from ${user.username}`);

                            return true;
                        };

                        const collector = message.createReactionCollector(filter, { time: inviteTime.diff(now) + ms('1m'), dispose: true });

                        collector.on('collect', (reaction, user) => {
                            let nickname = getUsernameForGuild(user, inviteMessage.guild);

                            reactedUsers.set(user.id, nickname);
                            options[reaction.emoji.name].set(user.id, nickname);

                            inviteMessage.edit('', {embed: embed()})
                                .catch(console.error);
                        });

                        collector.on('remove', (reaction, user) => {
                            reactedUsers.delete(user.id);
                            options[reaction.emoji.name].delete(user.id);

                            inviteMessage.edit('', {embed: embed()})
                                .catch(console.error);
                        });

                        collector.on('end', () => {
                            initialMessage.reply(`**Invitation has expired for ${inviteName}**`);
                            console.log(`Finished 'invite' for user ${initialMessage.author.username}`);
                            client.clearInterval(timer);
                        });

                        const timer = client.setInterval(
                            () => {
                                inviteMessage.edit('', {embed: embed()})
                                    .catch(console.error);

                                if (inviteTime.diff(moment()) <= 0) {
                                    client.clearInterval(timer);
                                }
                            },
                            ms('1m')
                        );
                    });
            });
    },
};
