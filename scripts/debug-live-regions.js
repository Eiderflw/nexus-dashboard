const { WebcastPushConnection } = require('tiktok-live-connector');
const fs = require('fs');
const https = require('https');

async function getGiftList(roomId) {
    return new Promise((resolve, reject) => {
        const url = `https://webcast.tiktok.com/webcast/gift/list/?aid=1988&room_id=${roomId}`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function getRoomInfo(roomId) {
    return new Promise((resolve, reject) => {
        const url = `https://webcast.tiktok.com/webcast/room/info/?aid=1988&room_id=${roomId}`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function debugLive(username) {
    console.log(`\n=== DEBUGGING: ${username} ===`);
    const tiktokLiveConnection = new WebcastPushConnection(username);

    try {
        const state = await tiktokLiveConnection.connect();
        const roomId = state.roomId;
        console.log(`   -> Connected! Room ID: ${roomId}`);

        const roomData = await getRoomInfo(roomId);
        const giftData = await getGiftList(roomId);

        const filenameRoom = `debug_room_${username}.json`;
        const filenameGifts = `debug_gifts_${username}.json`;

        fs.writeFileSync(filenameRoom, JSON.stringify(roomData, null, 2));
        fs.writeFileSync(filenameGifts, JSON.stringify(giftData, null, 2));

        console.log(`   -> Saved ${filenameRoom}`);
        console.log(`   -> Saved ${filenameGifts}`);

        const region = roomData?.data?.owner?.region;
        const gifts = giftData.data?.gifts || [];

        console.log(`   -> Room Info Region: ${region || 'MISSING'}`);
        console.log(`   -> Total Gifts: ${gifts.length}`);

        // Check for current triggers
        const US_GIFTS = [9971, 10619, 8042, 10649, 7086, 5650, 5651];
        const LATAM_GIFTS = [7032];

        const hasUS = gifts.filter(g => US_GIFTS.includes(g.id));
        const hasLATAM = gifts.filter(g => LATAM_GIFTS.includes(g.id));

        if (hasUS.length > 0) console.log(`   -> US TRIGGERS FOUND: ${hasUS.map(g => `${g.name} (${g.id})`).join(', ')}`);
        if (hasLATAM.length > 0) console.log(`   -> LATAM TRIGGERS FOUND: ${hasLATAM.map(g => `${g.name} (${g.id})`).join(', ')}`);

        await tiktokLiveConnection.disconnect();
    } catch (err) {
        console.error(`   -> Error: ${err.message}`);
    }
}

(async () => {
    const targets = ['aleja.c07', 'maa.awura.lala'];
    for (const t of targets) {
        await debugLive(t);
    }
})();
