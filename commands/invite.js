const { MessageEmbed, Collection } = require('discord.js');

const moment = require('moment-timezone');

const { setIntervalAsync, clearIntervalAsync } = require('set-interval-async/dynamic');

const ms = require('ms');

const config = require('../includes/config');

module.exports = {
    name: 'invite',
    description: 'Create an invite to an event',
    parameters: ['Event Name', '@', 'dd-mm-yyyy hh:mm'],
    hidden: false,
    run: async (client, message, args) => {
        if (args.length === 0 || typeof args[0] !== 'string') {
            return message.reply(`You didn\'t specify the event name or date and time for the invite!`);
        }

        if (args.indexOf('@') === -1) {
            return message.reply(`You didn\'t specify the event date and time for the invite!`);
        }

        if (!/[0-9]{2}-[0-9]{2}-[0-9]{4} [0-9]{2}:[0-9]{2}$/.test(args.join(' '))) {
            return message.reply(`You didn\'t specify the event date and time in a valid format!`);
        }

        let now = moment();
        const eventTime = moment(args.slice((args.indexOf('@') + 1), args.length).join(' ').concat(':00'), 'DD-MM-YYYY hh:mm:ss');

        if (eventTime.diff(now) <= 0) {
            return message.reply(`Invite occurs in the past!`);
        }

        const initialMessage = message;
        let eventMessage;
        let eventName = args.slice(0, args.indexOf('@')).join(' ');

        const reactedUsers = new Collection();
        const accepted = new Collection();
        const declined = new Collection();
        const tentative = new Collection();

        let embed = () => {
            return new MessageEmbed()
                .setColor(config.colors.primary)
                .setTitle(eventName)
                .setDescription(eventTime)
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
                .setFooter(`Occurs ${eventTime.fromNow()}`)
                .setTimestamp();
        };

        return message.channel.send(embed())
            .then(message => {
                eventMessage = message;
                console.log(`User ${initialMessage.author.username} created 'invite'`);

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

                        const collector = message.createReactionCollector(filter, { time: eventTime.diff(now), dispose: true });

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

                            eventMessage.edit('', {embed: embed()})
                                .then(message => eventMessage = message)
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

                            eventMessage.edit('', {embed: embed()})
                                .then(message => eventMessage = message)
                                .catch(console.error);
                        });

                        collector.on('end', () => {
                            initialMessage.reply(`**Invitation has expired**`);
                            console.log(`Finished 'invite' for user ${initialMessage.author.username}`);
                        });

                        const timer = setIntervalAsync(() => {
                            eventMessage.edit('', {embed: embed()})
                                .then(message => eventMessage = message)
                                .catch(console.error);

                            if (eventTime.diff(moment()) <= 0) {
                                clearIntervalAsync(timer);
                            }
                        }, ms('1m'));
                    });
            });
    },
};
