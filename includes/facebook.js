const request = require('request-promise-native');
const cheerio = require('cheerio');
const moment = require('moment-timezone');

const { MessageEmbed } = require('discord.js');

const htmlToText = require('html-to-text');

const config = require('../includes/config');

const getFacebookPosts = async () => {
    return await request.get({
        url: 'https://www.facebook.com/gumballs.dungeons/posts/',
        headers: {
            'User-Agent': 'Mozilla/5.0 (X11; Fedora; Linux x86_64; rv:64.0) Gecko/20100101 Firefox/64.0'
        }
    })
        .then( postsHtml => {
            const $ = cheerio.load(postsHtml);

            console.log('Completed Facebook request');

            const timeLinePostElements = $('.userContent').map((i,el) => $(el)).get();
            const result = timeLinePostElements.map(post => {
                return {
                    message: post.html(),
                    created_at: post.parents('.userContentWrapper').find('.timestampContent').html()
                };
            });

            console.log('Completed parsing Facebook request to posts');

            return result;
        })
};

const matchCodeInFacebookPost = (post) => {
    let pattern = /Classic &amp; Joint: ([a-zA-Z0-9]{6,12})/;

    if (post.message.includes('Classic &amp; Joint:')) {
        let matches = post.message.match(pattern);

        if (
            matches !== null &&
            matches[1] !== 'undefined' &&
            config.codes.filter(item => item.code === matches[1]).length === 0
        ) {
            return matches[1];
        }
    }

    return false;
}

const extractCodesFromFacebookPosts = async (client, posts, type, channels) => {
    for (const post of posts) {
        let code = matchCodeInFacebookPost(post);

        if (code !== false) {
            if (type === 'initial') {
                config.codes.push({ 'code': code, 'date': post.created_at });
                console.log(`Initial code: ${code}`);
            } else if (type === 'poll') {
                config.codes.unshift({ 'code': code, 'date': post.created_at });
                console.log(`Poll code: ${code}`);
                channels.forEach((channel) => {
                    channel.send(code)
                        .catch(console.error);
                });
            }
        }
    }

    console.log('Completed extracting codes from Facebook posts');

    return posts;
};

const matchUpdateInFacebookPost = (post) => {
    let pattern = /((?:&lt;|<)?([Vv]?[0-9]+\.[0-9]+\.[0-9]+)(?:&gt;|>)? )?Update Announcement/;

    if (post.message.includes('Update Announcement')) {
        let matches = post.message.match(pattern);

        if (
            matches !== null &&
            matches[2] !== 'undefined' &&
            config.updates.filter(item => item.version === matches[2]).length === 0
        ) {
            return matches[2];
        }
    }

    return false;
}

const createUpdateReminder = (client, channels, message) => {
    if (message.includes('Game Time')) {
        let now = moment();
        let maintenanceMessage = 'Scheduled server maintenance in 15m';
        let maintenanceUser = 'everyone';
        let datetime = null;
        let datetimeFormat = null;

        let pattern = /: ?(([0-9]{1,4})\/([0-9]{1,2})\/([0-9]{1,4}) [0-9]{2}:[0-9]{2}) ?- ?[0-9]{2}:[0-9]{2}/;
        let matches = message.match(pattern);

        if (
            matches !== null &&
            matches[1] !== 'undefined' &&
            matches[2] !== 'undefined' &&
            matches[3] !== 'undefined' &&
            matches[4] !== 'undefined'
        ) {
            datetime = matches[1];
            datetimeFormat = '';

            if (matches[2].length === 4) {
                datetimeFormat += 'Y/';

                if (parseInt(matches[3]) > 12) {
                    datetimeFormat += 'D/M';
                } else {
                    datetimeFormat += 'M/D';
                }
            } else {
                if (parseInt(matches[2]) > 12) {
                    datetimeFormat += 'D/M';
                } else {
                    datetimeFormat += 'M/D';
                }

                datetimeFormat += '/YYYY';
            }

            datetimeFormat += ' h:m';
        }

        if (datetime !== null && datetimeFormat !== null) {
            let maintenanceTime = moment.tz(datetime, 'Y/M/D h:m', 'Asia/Shanghai')
                .subtract(15, 'minutes')
                .tz('Europe/London');

            console.log(`Created 'maintenance reminder': ${maintenanceMessage} ~ ${maintenanceUser} @ ${maintenanceTime}`);

            client.setTimeout(
                () => {
                    channels.forEach((channel) => {
                        channel.send(`**Reminder:** ${maintenanceUser}, ${maintenanceMessage}`)
                            .catch(console.error);
                    });
                },
                maintenanceTime.diff(now)
            );
        }
    }
}

const extractUpdatesFromFacebookPosts = async (client, posts, type, channels) => {
    for (const post of posts) {
        let update = matchUpdateInFacebookPost(post);

        if (update !== false) {
            if (type === 'initial') {
                config.updates.push({ 'version': update, 'date': post.created_at });
                console.log(`Initial update: ${update}`);
            } else if (type === 'poll') {
                config.updates.unshift({ 'version': update, 'date': post.created_at });
                console.log(`Poll update: ${update}`);

                let message = htmlToText.fromString(post.message).substring(1, 2048).split('See more')[0];

                const embed = new MessageEmbed()
                    .setColor(0x17A2B8)
                    .setTitle('Update Announcement')
                    .setDescription(message)
                    .setFooter(`Version ${update}`)
                    .setURL(`https://www.facebook.com${post.message.match(/href="(.+)" /)[1]}`);

                channels.forEach((channel) => {
                    channel.send(embed)
                        .catch(console.error);
                });

                createUpdateReminder(client, channels, message);
            }
        }
    }

    console.log('Completed extracting updates from Facebook posts');

    return posts;
};

exports.getFacebookPosts = getFacebookPosts;
exports.extractCodesFromFacebookPosts = extractCodesFromFacebookPosts;
exports.extractUpdatesFromFacebookPosts = extractUpdatesFromFacebookPosts;
