const axios = require('axios');

async function testWebcast(roomId) {
    const url = `https://webcast.tiktok.com/webcast/room/info/?room_id=${roomId}&aid=1988&device_id=7000000000000000000`;
    console.log(`Testing Webcast API: ${url}`);

    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const data = response.data;
        if (data && data.data) {
            const owner = data.data.owner;
            if (owner) {
                console.log('--- FOUND OWNER DATA ---');
                console.log(`Nickname: ${owner.nickname}`);
                console.log(`Region: ${owner.region}`);
                console.log(`Method: Webcast API (Direct)`);
            } else {
                console.log('Data found but owner is missing.');
                console.log(JSON.stringify(data.data, null, 2));
            }
        } else {
            console.log('No data returned from Webcast API.');
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error(`Error: ${e.message}`);
    }
}

const roomId = process.argv[2] || '7608708502617377556';
testWebcast(roomId);
