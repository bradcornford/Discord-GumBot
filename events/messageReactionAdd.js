/**
 * @param {MessageReaction} reaction
 * @param {User} user
 */
module.exports = async (reaction, user) => {
    if (reaction.message.content.substring(0, reaction.message.content.indexOf(' ')) === '📋' &&
        !['👍', '👎'].includes(reaction.users.reaction.emoji.name)
    ) {
        reaction.users.reaction.users.remove(user.id)
            .then(() => console.log(`Deleted unrecognised 'poll' reaction from ${user.username}`))
            .catch(console.error);
    }
};
