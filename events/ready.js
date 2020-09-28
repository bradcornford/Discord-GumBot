const { setIntervalAsync } = require('set-interval-async/dynamic')

const { getFacebookPosts, extractCodesFromFacebookPosts } = require('../includes/facebook')

const config = require('../includes/config');

/**
 * @param {Client} client
 */
module.exports = (client) => {
    console.log(`${client.user.username} is now online!`);

    let channel = client.channels.cache.find(channel => channel.name === config.discordCodesChannel)

    getFacebookPosts()
        .then((posts) => extractCodesFromFacebookPosts(posts, 'initial', channel))
        .then(() => {
            console.log('Completed initial Facebook request for codes');
        })
        .then(() => {
            setIntervalAsync(
                async () => {
                    await getFacebookPosts()
                        .then((posts) => extractCodesFromFacebookPosts(posts, 'poll', channel))
                        .then(() => {
                            console.log('Completed Facebook poll request for new codes');
                        })
                        .catch(console.error);
                },
                config.pollInterval
            )
        })
        .catch(console.error);
};
