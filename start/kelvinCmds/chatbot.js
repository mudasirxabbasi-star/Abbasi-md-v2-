const axios = require("axios");
const db = require('../../start/Core/databaseManager'); 

// Message memory for conversation context
let messageMemory = new Map();
const MAX_MEMORY = 150;

function updateMemory(chatId, message, isUser = true) {
    if (!messageMemory.has(chatId)) {
        messageMemory.set(chatId, []);
    }
    
    const chatMemory = messageMemory.get(chatId);
    chatMemory.push({
        role: isUser ? "user" : "assistant",
        content: message,
        timestamp: Date.now()
    });
    
    if (chatMemory.length > MAX_MEMORY) {
        messageMemory.set(chatId, chatMemory.slice(-MAX_MEMORY));
    }
}

function cleanResponse(text) {
    if (!text) return text;
    
    const patterns = [
        /^Hello!.*?I'm.*?AI.*?\./i,
        /^Hi!.*?I'm.*?AI.*?\./i,
        /^Hey!.*?I'm.*?AI.*?\./i,
        /^I'm.*?AI.*?\./i,
        /^Hello! How can I assist you.*?\./i,
        /^Hi there!.*?\./i,
        /^Greetings!.*?\./i,
        /^I'm an AI assistant.*?\./i,
        /^I'm here to help.*?\./i,
        /^What can I help you with\?\s*/i,
        /^How can I assist you today\?\s*/i,
        /^What's on your mind\?\s*/i
    ];
    
    let cleaned = text;
    for (const pattern of patterns) {
        cleaned = cleaned.replace(pattern, '');
    }
    
    return cleaned.trim() || text;
}

async function handleAIChatbot(m, kelvin, body, from, isGroup, botNumber, isCmd, prefix) {
    try {
        const AI_CHAT = await db.get(botNumber, 'AI_CHAT', false);
        if (!AI_CHAT) return false;

        if (!body || m.key.fromMe || body.startsWith(prefix)) return false;
        
        const senderJid = m.sender;
        const senderNumber = senderJid.replace(/[^0-9]/g, "");
        
        const ignoredNumbers = ['256742932677', '256755585369'];
        const isIgnored = ignoredNumbers.some(num => {
            const normalizedNum = num.replace(/[^0-9]/g, "");
            return senderNumber === normalizedNum;
        });
        
        if (isIgnored) return false;

        let shouldRespond = true;
        
        if (isGroup) {
            const mentionedJids = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            const isMentioned = mentionedJids.some(jid => {
                const normalizedJid = jid.replace(/[^0-9]/g, "");
                const normalizedBot = botNumber.replace(/[^0-9]/g, "");
                return normalizedJid === normalizedBot;
            });
            
            const isReplyToBot = m.message?.extendedTextMessage?.contextInfo?.participant === botNumber;
            
            if (!isMentioned && !isReplyToBot) return false;
            shouldRespond = true;
        }

        if (!shouldRespond) return false;

        await kelvin.sendPresenceUpdate('composing', from);
        updateMemory(from, body, true);

        let response = null;
        
        // Check if asking about creator/developer
        const isAskingAboutCreator = /(who made you|who created you|who is your (creator|developer|owner)|who are you|what are you|your developer|your creator)/i.test(body);
        
        if (isAskingAboutCreator) {
            response = "I was created by Kelvin Tech, a skilled developer from Uganda with exceptional coding abilities.";
        } else {
            // Try Llama3 API
            try {
                const apiUrl = `https://apis.davidcyril.name.ng/ai/llama3?text=${encodeURIComponent(body)}`;
                const { data } = await axios.get(apiUrl, { timeout: 15000 });
                // Check both 'message' and 'result' fields
                if (data && data.success && data.message) {
                    response = cleanResponse(data.message);
                } else if (data && data.result) {
                    response = cleanResponse(data.result);
                }
            } catch (llamaError) {
                console.log('Llama3 API error:', llamaError.message);
            }
            
            // Fallback to Malvin Venice API
            if (!response) {
                try {
                    const apiUrl = `https://malvin-api.vercel.app/ai/venice?text=${encodeURIComponent(body)}`;
                    const { data } = await axios.get(apiUrl, { timeout: 15000 });
                    if (data && data.result) response = data.result;
                    else if (data && data.message) response = data.message;
                } catch (malvinError) {
                    console.log('Venice API error:', malvinError.message);
                }
            }
        }
        
        if (!response) {
            response = "I'm having trouble responding right now. Please try again later.";
        }

        updateMemory(from, response, false);
        
        await kelvin.sendMessage(from, { text: response }, { quoted: m });
        return true;

    } catch (err) {
        console.error('Chatbot error:', err);
        return false;
    }
}

module.exports = { handleAIChatbot };