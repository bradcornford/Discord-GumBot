const { MessageEmbed, Collection } = require('discord.js');

const moment = require('moment-timezone');

const ms = require('string-to-ms');

const config = require('../includes/config');

const { validateMessageFromInput, validateTimeFromInput, extractMessageFromInput, extractTimeFromInput } = require('../includes/input');

const { timeRemaining } = require('../includes/timeRemaining');

module.exports = {
    name: 'invite',
    description: 'Create an invite to an event',
    parameters: [
        'Event Name',
        '@',
        '[', 'dd-mm-yyyy hh:mm', '|', 'hh:mm' , '|' , '1d 1h 1m', ']'
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

        const reactedUsers = new Collection();
        const accepted = new Collection();
        const declined = new Collection();
        const tentative = new Collection();

        let embed = () => {
            return new MessageEmbed()
                .setColor(config.colors.primary)
                .setTitle(inviteName)
                .setDescription(inviteTime)
                .addFields(
                    {
                        name: 'Accepted',
                        value: (accepted.size === 0 ? '-' : accepted.map((username) => { return username; }).join(`\n`)),
                        inline: true,
                    },
                    {
                        name: 'Declined',
                        value: (declined.size === 0 ? '-' : declined.map((username) => { return username; }).join(`\n`)),
                        inline: true,
                    },
                    {
                        name: 'Tentative',
                        value: (tentative.size === 0 ? '-' : tentative.map((username) => { return username; }).join(`\n`)),
                        inline: true,
                    },
                )
                .setAuthor(`Created by ${message.author.username}`)
                .setFooter(inviteTime.diff(moment()) <= 0 ? 'Occurred' : `Occurs in ${timeRemaining(inviteTime.diff(moment()))}`)
                .setTimestamp();
        };

        message.author.send(`✉️ **Created invite:** ${inviteName} @ ${inviteTime}`)
            .catch(console.error);

        return message.channel.send(embed())
            .then(message => {
                inviteMessage = message;
                console.log(`User ${initialMessage.author.username} created 'invite': ${inviteName} @ ${inviteTime}`);

                message.react('✅')
                    .then(() => message.react('❌'))
                    .then(() => message.react('❓'))
                    .then(() => {
                        const filter = (reaction, user) => {
                            if (!['✅', '❌', '❓'].includes(reaction.emoji.name)) {
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

                        const collector = message.createReactionCollector(filter, { time: inviteTime.diff(now), dispose: true });

                        collector.on('collect', (reaction, user) => {
                            reactedUsers.set(user.id, user.username);

                            switch(reaction.emoji.name) {
                                case '✅':
                                    accepted.set(user.id, user.username);
                                    break;
                                case '❌':
                                    declined.set(user.id, user.username);
                                    break;
                                case '❓':
                                    tentative.set(user.id, user.username);
                                    break;
                            }

                            inviteMessage.edit('', {embed: embed()})
                                .then(message => inviteMessage = message)
                                .catch(console.error);
                        });

                        collector.on('remove', (reaction, user) => {
                            reactedUsers.delete(user.id);

                            switch(reaction.emoji.name) {
                                case '✅':
                                    accepted.delete(user.id);
                                    break;
                                case '❌':
                                    declined.delete(user.id);
                                    break;
                                case '❓':
                                    tentative.delete(user.id);
                                    break;
                            }

                            inviteMessage.edit('', {embed: embed()})
                                .then(message => inviteMessage = message)
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
                                    .then(message => inviteMessage = message)
                                    .catch(error => {
                                        console.error(error);
                                        client.clearInterval(timer);
                                    });

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
