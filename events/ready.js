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

    let codesChannel = client.channels.cache.find(channel => channel.name === config.discordCodesChannel);

    if (!codesChannel) {
        console.error(`Unable to find the codes channel "${config.discordCodesChannel}"`);
    }

    let updatesChannel = client.channels.cache.find(channel => channel.name === config.discordUpdatesChannel);

    if (!updatesChannel) {
        console.error(`Unable to find the updates channel "${config.discordUpdatesChannel}"`);
    }

    if (!codesChannel && !updatesChannel) {
        console.error(`Unable to find the codes/updates channels skipping Facebook requests`);

        return;
    }

    let codeExtraction = (posts, method) => {
        if (!codesChannel) {
            return posts;
        }

        return extractCodesFromFacebookPosts(posts, method, codesChannel)
    }

    let updateExtraction = (posts, method) => {
        if (!updatesChannel) {
            return posts;
        }

        return extractUpdatesFromFacebookPosts(posts, method, updatesChannel)
    }

    getFacebookPosts()
        .then((posts) => codeExtraction(posts, 'initial'))
        .then((posts) => updateExtraction(posts, 'initial'))
        .then(() => client.setInterval(
                async () => {
                    await getFacebookPosts()
                        .then((posts) => codeExtraction(posts, 'poll'))
                        .then((posts) => updateExtraction(posts, 'poll'))
                        .catch(console.error);
                },
                config.pollInterval
            ))
        .catch(console.error);
};
