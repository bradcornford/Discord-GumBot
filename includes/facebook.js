const request = require('request-promise-native');
const cheerio = require('cheerio');

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
            const timeLinePostElements = $('.userContent').map((i,el) => $(el)).get();
            return timeLinePostElements.map(post => {
                return {
                    message: post.html(),
                    created_at: post.parents('.userContentWrapper').find('.timestampContent').html()
                }
            });
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

const extractCodesFromFacebookPosts = async (posts, type, channel) => {
    for (const post of posts) {
        let code = matchCodeInFacebookPost(post);

        if (code !== false) {
            if (type === 'initial') {
                config.codes.push({ 'code': code, 'date': post.created_at });
                console.log(`Initial code: ${code}`);
            } else if (type === 'poll') {
                config.codes.unshift({ 'code': code, 'date': post.created_at });
                console.log(`Current code: ${code}`);
                channel.send(code)
                    .catch(console.error);
            }
        }
    }
};

exports.getFacebookPosts = getFacebookPosts;
exports.extractCodesFromFacebookPosts = extractCodesFromFacebookPosts;
