const axios = require('axios');

module.exports = [
    {
        command: ['news', 'bbcnews', 'worldnews'],
        operate: async ({ kelvin, m, reply, args, prefix }) => {
            let source = args[0]?.toLowerCase() || 'bbc';
            let category = args[1]?.toLowerCase() || 'world';
            
            const validSources = ['bbc', 'aljazeera', 'aljazeera'];
            const validCategories = ['world', 'technology', 'business', 'health', 'science', 'entertainment'];
            
            if (!validSources.includes(source)) {
                return reply(`Available sources: bbc, aljazeera\n\nExample: ${prefix}news bbc world\nExample: ${prefix}news aljazeera`);
            }

            try {
                await reply(`Fetching ${category} news from ${source}...`);

                let apiUrl;
                if (source === 'bbc') {
                    apiUrl = `https://apis.davidcyril.name.ng/news/bbc?category=${category}`;
                } else {
                    apiUrl = `https://apis.davidcyril.name.ng/news/aljazeera`;
                }
                
                const response = await axios.get(apiUrl);
                
                if (response.data?.success && response.data?.articles?.length > 0) {
                    const articles = response.data.articles.slice(0, 5);
                    
                    for (const article of articles) {
                        let message = `📰 *${article.title}*\n\n`;
                        message += `📝 ${article.description || 'No description'}\n\n`;
                        message += `🕒 ${new Date(article.pubDate).toLocaleString()}\n`;
                        message += `🔗 ${article.link}\n\n`;
                        message += `> ${global.wm || 'Vesper-Xmd'}`;
                        
                        if (article.image && article.image !== '') {
                            await kelvin.sendMessage(m.chat, {
                                image: { url: article.image },
                                caption: message
                            }, { quoted: m });
                        } else {
                            await reply(message);
                        }
                    }
                } else {
                    reply(`No news found from ${source}`);
                }
            } catch (error) {
                console.error('News error:', error);
                reply('Failed to fetch news. Please try again later.');
            }
        }
    },
    {
        command: ['aljazeera', 'ajnews', 'jazeera'],
        operate: async ({ kelvin, m, reply, args, prefix }) => {
            try {
                await reply(`Fetching Al Jazeera news...`);

                const apiUrl = `https://apis.davidcyril.name.ng/news/aljazeera`;
                const response = await axios.get(apiUrl);
                
                if (response.data?.success && response.data?.articles?.length > 0) {
                    const articles = response.data.articles.slice(0, 5);
                    
                    for (const article of articles) {
                        let message = `📰 *${article.title}*\n\n`;
                        message += `📝 ${article.description || 'No description'}\n\n`;
                        message += `🕒 ${new Date(article.pubDate).toLocaleString()}\n`;
                        message += `🔗 ${article.link}\n\n`;
                        message += `> ${global.wm || 'Vesper-Xmd'}`;
                        
                        await reply(message);
                    }
                } else {
                    reply('No Al Jazeera news found.');
                }
            } catch (error) {
                console.error('Al Jazeera error:', error);
                reply('Failed to fetch Al Jazeera news.');
            }
        }
    },
    {
        command: ['topnews', 'headlines'],
        operate: async ({ kelvin, m, reply, args, prefix }) => {
            try {
                await reply(`Fetching top headlines...`);

                const apiUrl = `https://apis.davidcyril.name.ng/news/bbc?category=world`;
                const response = await axios.get(apiUrl);
                
                if (response.data?.success && response.data?.articles?.length > 0) {
                    const topStories = response.data.articles.slice(0, 5);
                    
                    for (const article of topStories) {
                        let message = `🔥 *${article.title}*\n\n`;
                        message += `📝 ${article.description?.substring(0, 150)}${article.description?.length > 150 ? '...' : ''}\n\n`;
                        message += `🔗 ${article.link}\n\n`;
                        message += `> ${global.wm || 'Vesper-Xmd'}`;
                        
                        if (article.image && article.image !== '') {
                            await kelvin.sendMessage(m.chat, {
                                image: { url: article.image },
                                caption: message
                            }, { quoted: m });
                        } else {
                            await reply(message);
                        }
                    }
                } else {
                    reply('No headlines found.');
                }
            } catch (error) {
                console.error('Headlines error:', error);
                reply('Failed to fetch headlines.');
            }
        }
    },
    {
    command: ['sportsnews', 'sports', 'sport'],
    operate: async ({ kelvin, m, reply, args, prefix }) => {
        try {
            await reply(`Fetching sports news...`);

            const axios = require('axios');
            const apiUrl = `https://apis.davidcyril.name.ng/news/sports`;
            const response = await axios.get(apiUrl);
            
            if (response.data?.success && response.data?.articles?.length > 0) {
                const articles = response.data.articles.slice(0, 5);
                
                for (const article of articles) {
                    let message = `⚽ *${article.title}*\n\n`;
                    message += `📝 ${article.description || 'No description'}\n\n`;
                    message += `🕒 ${new Date(article.pubDate).toLocaleString()}\n`;
                    message += `🔗 ${article.link}\n\n`;
                    message += `> ${global.wm || 'Vesper-Xmd'}`;
                    
                    if (article.image && article.image !== '') {
                        await kelvin.sendMessage(m.chat, {
                            image: { url: article.image },
                            caption: message
                        }, { quoted: m });
                    } else {
                        await reply(message);
                    }
                }
            } else {
                reply('No sports news found.');
            }
        } catch (error) {
            console.error('Sports news error:', error);
            reply('Failed to fetch sports news.');
        }
    }
}
];