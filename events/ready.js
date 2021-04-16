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
        config.discordCodesChannel.split(',').forEach((discordCodesChannel) => {
            let codeChannel = guild.channels.cache.find(channel => channel.name === discordCodesChannel);

            if (codeChannel) {
                codesChannels.push(codeChannel);
            }
        });
    });

    const updatesChannels = [];

    client.guilds.cache.map((guild) => {
        config.discordUpdatesChannel.split(',').forEach((discordUpdatesChannel) => {
            let updatesChannel = guild.channels.cache.find(channel => channel.name === discordUpdatesChannel);

            if (updatesChannel) {
                updatesChannels.push(updatesChannel);
            }
        });
    });

    if (codesChannels.length === 0 && updatesChannels.length === 0) {
        console.error(`Unable to find the codes/updates channels skipping Facebook requests`);

        return;
    }

    let codeExtraction = (client, posts, method) => {
        if (codesChannels.length === 0) {
            console.info(`Skipping code extraction as no codes channels available`);

            return posts;
        }

        return extractCodesFromFacebookPosts(client, posts, method, codesChannels)
    }

    let updateExtraction = (client, posts, method) => {
        if (!updatesChannels) {
            console.info(`Skipping update extraction as no updates channels available`);

            return posts;
        }

        return extractUpdatesFromFacebookPosts(client, posts, method, updatesChannels)
    }

    getFacebookPosts()
        .then((posts) => codeExtraction(client, posts, 'initial'))
        .then((posts) => updateExtraction(client, posts, 'initial'))
        .then(() => client.setInterval(
                async () => {
                    await getFacebookPosts()
                        .then((posts) => codeExtraction(client, posts, 'poll'))
                        .then((posts) => updateExtraction(client, posts, 'poll'))
                        .catch(console.error);
                },
                config.pollInterval
            ))
        .catch(console.error);
};
