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

    const codesChannels = [];

    client.guilds.cache.map((guild) => {
        let codeChannel = guild.channels.cache.find(channel => channel.name === config.discordCodesChannel);

        if (codeChannel) {
            codesChannels.push(codeChannel);
        }
    });

    const updatesChannels = [];

    client.guilds.cache.map((guild) => {
        let updatesChannel = guild.channels.cache.find(channel => channel.name === config.discordUpdatesChannel);

        if (updatesChannel) {
            updatesChannels.push(updatesChannel);
        }
    });

    if (codesChannels.length === 0 && updatesChannels.length === 0) {
        console.error(`Unable to find the codes/updates channels skipping Facebook requests`);

        return;
    }

    let codeExtraction = (posts, method) => {
        if (codesChannels.length === 0) {
            console.info(`Skipping code extraction as no codes channels available`);

            return posts;
        }

        return extractCodesFromFacebookPosts(posts, method, codesChannels)
    }

    let updateExtraction = (posts, method) => {
        if (!updatesChannels) {
            console.info(`Skipping update extraction as no updates channels available`);

            return posts;
        }

        return extractUpdatesFromFacebookPosts(posts, method, updatesChannels)
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
