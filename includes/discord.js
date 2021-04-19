const getUsernameForGuild = (user, guild) => {
    const member = guild.members.cache.get(user.id);

    return (member ? (member.nickname ? member.nickname : user.username) : user.username);
}

const getEmoteForGuild = (emote, guild) => {
    const emoteRegex = /<:.+:(\d+)>/gm;
    const animatedEmoteRegex = /<a:.+:(\d+)>/gm;
    let matches;
    let id = null;

    if (matches = emoteRegex.exec(emote)) {
        console.log(matches)
        id = parseInt(matches[1]);
    } else if (matches = animatedEmoteRegex.exec(emote)) {
        id = parseInt(matches[1]);
    }

    const emoji = guild.emojis.cache.find(emoji => emoji.id === id);

    return (emoji ? emoji : null);
}

exports.getUsernameForGuild = getUsernameForGuild;
exports.getEmoteForGuild = getEmoteForGuild;
