// Native fetch is available in Node 18+

async function test() {
    const targetUrl = "https://live-backstage.tiktok.com/";
    const proxyUrl = `http://localhost:3000/api/tiktok/proxy?url=${encodeURIComponent(targetUrl)}`;

    console.log("Fetching:", proxyUrl);
    try {
        const res = await fetch(proxyUrl);
        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Body Hint:", text.substring(0, 1000));

        // Write full body to file
        const fs = require('fs');
        fs.writeFileSync('debug_api_response.html', text);
        console.log("Saved response to debug_api_response.html");
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

test();
