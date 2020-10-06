const config = require('../includes/config');

/**
 * @param {Client}  client
 * @param {Message} message
 */
module.exports = async (client, message) => {
    if (message.author.bot) {
        return;
    }

    if (!message.content.toLowerCase().startsWith(config.prefix)) {
        return;
    }

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) {
        return;
    }

    let command = client.commands.get(cmd);

    if (command) {
        command.run(client, message, args)
            .then(() => {
                message.delete({ timeout: 1000 })
                    .then(message => console.log(`Deleted '${command.name}' message from ${message.author.username} after 1 seconds`))
                    .catch(console.error);
            })
            .catch(console.error)
    }
};
