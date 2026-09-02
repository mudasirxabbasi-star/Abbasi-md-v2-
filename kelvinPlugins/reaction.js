const axios = require('axios');
const sharp = require('sharp');
const { getBuffer } = require('../start/lib/myfunction');

const ANIMU_BASE = 'https://api.some-random-api.com/animu';
const WAIFU_BASE = 'https://api-faa.my.id/faa/waifu';

async function convertToSticker(mediaBuffer) {
    try {
        const sticker = await sharp(mediaBuffer)
            .resize(512, 512, { fit: 'cover' })
            .webp()
            .toBuffer();
        return sticker;
    } catch (error) {
        console.error('Error converting to sticker:', error);
        return null;
    }
}

// FIXED: Properly download image from Faa API
async function fetchAndSendSticker(kelvin, from, endpoint, m) {
    try {
        const { data } = await axios.get(endpoint);
        
        if (data.link || data.url) {
            const imageUrl = data.link || data.url;
            
            // Download image using getBuffer
            const imageBuffer = await getBuffer(imageUrl);
            
            if (!imageBuffer) {
                console.error('Failed to download image');
                return false;
            }
            
            const stickerBuf = await convertToSticker(imageBuffer);
            
            if (stickerBuf) {
                await kelvin.sendMessage(from, { sticker: stickerBuf }, { quoted: m });
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('Error fetching sticker:', error);
        return false;
    }
}

// FIXED: For Waifu API that returns JSON with image URL
async function sendWaifu(kelvin, from, type, m) {
    try {
        const apiUrl = `${WAIFU_BASE}/${type}`;
        console.log(`Fetching from: ${apiUrl}`);
        
        const { data } = await axios.get(apiUrl, { timeout: 15000 });
        
        // Faa API returns { status: true, url: "https://..." }
        if (data && data.status === true && data.url) {
            // Download the image using getBuffer
            const imageBuffer = await getBuffer(data.url);
            
            if (!imageBuffer) {
                await kelvin.sendMessage(from, { text: `❌ Failed to fetch ${type} image` }, { quoted: m });
                return;
            }
            
            // Convert to sticker
            const stickerBuf = await convertToSticker(imageBuffer);
            
            if (stickerBuf) {
                await kelvin.sendMessage(from, { sticker: stickerBuf }, { quoted: m });
            } else {
                // Fallback: send as image
                await kelvin.sendMessage(from, { image: imageBuffer }, { quoted: m });
            }
        } else {
            await kelvin.sendMessage(from, { text: `❌ No ${type} image found` }, { quoted: m });
        }
    } catch (error) {
        console.error(`Error in ${type} command:`, error.message);
        await kelvin.sendMessage(from, { text: `❌ Error: ${error.message}` }, { quoted: m });
    }
}

// For Animu API (works the same)
async function sendAnimu(kelvin, from, type, m) {
    try {
        const apiUrl = `${ANIMU_BASE}/${type}`;
        const { data } = await axios.get(apiUrl);
        
        if (data.link) {
            const imageBuffer = await getBuffer(data.link);
            const stickerBuf = await convertToSticker(imageBuffer);
            
            if (stickerBuf) {
                await kelvin.sendMessage(from, { sticker: stickerBuf }, { quoted: m });
            } else {
                await kelvin.sendMessage(from, { image: imageBuffer }, { quoted: m });
            }
        }
    } catch (error) {
        console.error(`Error in animu ${type}:`, error.message);
        await kelvin.sendMessage(from, { text: `❌ Error fetching ${type}` }, { quoted: m });
    }
}

// Fix the sendWaifu function to work with kelvin.sendImageAsSticker properly
async function sendWaifuAsSticker(kelvin, from, type, m) {
    try {
        const apiUrl = `${WAIFU_BASE}/${type}`;
        const { data } = await axios.get(apiUrl);
        
        if (data && data.status === true && data.url) {
            // Use sendImageAsSticker with URL directly (if your function supports it)
            // Or download and convert manually
            const imageBuffer = await getBuffer(data.url);
            const stickerBuf = await convertToSticker(imageBuffer);
            
            if (stickerBuf) {
                await kelvin.sendMessage(from, { sticker: stickerBuf }, { quoted: m });
            } else {
                await kelvin.sendMessage(from, { image: imageBuffer, caption: `💕 ${type}` }, { quoted: m });
            }
        } else {
            await kelvin.sendMessage(from, { text: `❌ No ${type} found` }, { quoted: m });
        }
    } catch (error) {
        console.error(`Error in ${type}:`, error.message);
        await kelvin.sendMessage(from, { text: `❌ Error: ${error.message}` }, { quoted: m });
    }
}

module.exports = [
    // Animu commands
    {
        command: ['animu', 'animequote'],
        operate: async ({ kelvin, m, args }) => {
            const type = args[0]?.toLowerCase() || 'quote';
            let normalized = type;
            if (type === 'facepalm' || type === 'face_palm') normalized = 'face-palm';
            if (type === 'quote') normalized = 'quote';
            await sendAnimu(kelvin, m.chat, normalized, m);
        }
    },
    {
        command: ['animuwink'],
        operate: async ({ kelvin, m }) => {
            await sendAnimu(kelvin, m.chat, 'wink', m);
        }
    },
    {
        command: ['animupat'],
        operate: async ({ kelvin, m }) => {
            await sendAnimu(kelvin, m.chat, 'pat', m);
        }
    },
    {
        command: ['animuhug'],
        operate: async ({ kelvin, m }) => {
            await sendAnimu(kelvin, m.chat, 'hug', m);
        }
    },
    // Waifu.pics commands (FIXED - using sendWaifu)
    {
        command: ['kiss', 'cium', 'beso'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'kiss', m);
        }
    },
    {
        command: ['cry'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'cry', m);
        }
    },
    {
        command: ['blush'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'blush', m);
        }
    },
    {
        command: ['dance'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'dance', m);
        }
    },
    {
        command: ['kill'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'kill', m);
        }
    },
    {
        command: ['hug'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'hug', m);
        }
    },
    {
        command: ['kick'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'kick', m);
        }
    },
    {
        command: ['slap'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'slap', m);
        }
    },
    {
        command: ['happy'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'happy', m);
        }
    },
    {
        command: ['bully'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'bully', m);
        }
    },
    {
        command: ['pat', 'headpat'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'pat', m);
        }
    },
    {
        command: ['poke'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'poke', m);
        }
    },
    {
        command: ['cuddle'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'cuddle', m);
        }
    },
    {
        command: ['smile'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'smile', m);
        }
    },
    {
        command: ['wave'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'wave', m);
        }
    },
    {
        command: ['bite'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'bite', m);
        }
    },
    {
        command: ['lick'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'lick', m);
        }
    },
    {
        command: ['bonk'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'bonk', m);
        }
    },
    {
        command: ['yeet'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'yeet', m);
        }
    },
    {
        command: ['nom'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'nom', m);
        }
    },
    {
        command: ['tickle'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'tickle', m);
        }
    },
    {
        command: ['facepalm'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'facepalm', m);
        }
    },
    {
        command: ['handhold', 'holdhands'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'handhold', m);
        }
    },
    {
        command: ['stare'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'stare', m);
        }
    },
    {
        command: ['shrug'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'shrug', m);
        }
    },
    {
        command: ['scream'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'scream', m);
        }
    },
    {
        command: ['pout'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'pout', m);
        }
    },
    {
        command: ['shy'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'shy', m);
        }
    },
    {
        command: ['thinking'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'thinking', m);
        }
    },
    {
        command: ['love'],
        operate: async ({ kelvin, m }) => {
            await sendWaifu(kelvin, m.chat, 'love', m);
        }
    }
];