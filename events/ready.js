const { setIntervalAsync } = require('set-interval-async/dynamic')

const { getFacebookPosts, extractCodesFromFacebookPosts, extractUpdatesFromFacebookPosts } = require('../includes/facebook')

const config = require('../includes/config');

/**
 * @param {Client} client
 */
module.exports = (client) => {
    console.log(`${client.user.username} is now online!`);

    client.user.setActivity(`version ${config.version}`, { type: 'PLAYING' })
        .then(presence => console.log(`Activity set to ${presence.activities[0].name}`))
        .catch(console.error);

    let codesChannel = client.channels.cache.find(channel => channel.name === config.discordCodesChannel)
    let updatesChannel = client.channels.cache.find(channel => channel.name === config.discordUpdatesChannel)

    getFacebookPosts()
        .then((posts) => {
            console.log('Completed initial Facebook request');

            return posts;
        })
        .then((posts) => extractCodesFromFacebookPosts(posts, 'initial', codesChannel))
        .then((posts) => {
            console.log('Completed extracting codes from Facebook posts');

            return posts;
        })
        .then((posts) => extractUpdatesFromFacebookPosts(posts, 'initial', updatesChannel))
        .then(() => {
            console.log('Completed extracting updates from Facebook posts');
        })
        .then(() => {
            setIntervalAsync(
                async () => {
                    await getFacebookPosts()
                        .then((posts) => {
                            console.log('Completed Facebook poll request');

                            return posts;
                        })
                        .then((posts) => extractCodesFromFacebookPosts(posts, 'poll', codesChannel))
                        .then((posts) => {
                            console.log('Completed extracting codes from Facebook posts');

                            return posts;
                        })
                        .then((posts) => extractUpdatesFromFacebookPosts(posts, 'poll', updatesChannel))
                        .then(() => {
                            console.log('Completed extracting updates from Facebook posts');
                        })
                        .catch(console.error);
                },
                config.pollInterval
            )
        })
        .catch(console.error);
};
