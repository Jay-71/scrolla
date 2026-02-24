import https from 'https';

const URLS = [
    "https://lottiefiles.com/free-animation/pencil-loading-pARybextv7",
    "https://lottiefiles.com/free-animation/dot-VlATMGT0n3",
    "https://lottiefiles.com/free-animation/success-XnuBx2rTJK",
    "https://lottiefiles.com/free-animation/pos-x0GK1EWQyh",
    "https://lottiefiles.com/free-animation/circular-pattern-rAtWgI41hS",
    "https://lottiefiles.com/free-animation/one-color-smoke-animation-PrRmwsg1ut",
    "https://lottiefiles.com/free-animation/like-KheqVEbOhD",
    "https://lottiefiles.com/free-animation/success-animation-FgqHopNZsf",
    "https://lottiefiles.com/free-animation/fail-JBoMY3yT9Z",
    "https://lottiefiles.com/free-animation/namaste-animation-9xwMhYeRfM",
    "https://lottiefiles.com/free-animation/check-out-QMs8nk6qJ9",
    "https://lottiefiles.com/free-animation/teacher-EmgPkoIzwP",
    "https://lottiefiles.com/free-animation/categorizing-cards-mobile-sorting-loader-TkzLJADCWe",
    "https://lottiefiles.com/free-animation/rocket-AX7DkdRDxn",
    "https://lottiefiles.com/free-animation/halloween-pumpkin-black-cat-s5D5t6lBfi",
    "https://lottiefiles.com/free-animation/heartjumps-xgRpotTH40",
    "https://lottiefiles.com/free-animation/mark-the-screen-vsvsNvXnen",
    "https://lottiefiles.com/free-animation/lock-butter-BX6vvXdaZP",
    "https://lottiefiles.com/free-animation/new-dashboard-animation-cnLmeafgls",
    "https://lottiefiles.com/free-animation/loading-screen-animation-bbnUkmvDLU",
    "https://lottiefiles.com/free-animation/hearth-emoji-3gthBuU6BF",
    "https://lottiefiles.com/free-animation/hot-and-new-Rnpq4J9h19",
    "https://lottiefiles.com/free-animation/animation-graph-niVi6sWGMS",
    "https://lottiefiles.com/free-animation/valentine-lottie-UaK1UHwcn8",
    "https://lottiefiles.com/free-animation/loading-ring-7FrndZriq7",
    "https://lottiefiles.com/free-animation/emoji-idea-Ezl1bDKUZw",
    "https://lottiefiles.com/free-animation/delivery-animation-XyWPMroRrG",
    "https://lottiefiles.com/free-animation/success-delivery-red-PMo5zIJ68t",
    "https://lottiefiles.com/free-animation/bg-mZXj9iid6h",
    "https://lottiefiles.com/free-animation/raccoon-loop-animation-RxQeq912rh",
    "https://lottiefiles.com/free-animation/confetti-6bOsrcIrcA",
    "https://lottiefiles.com/free-animation/loading-dots-QR9SJlO4jf",
    "https://lottiefiles.com/free-animation/couponsuceessful2-qJsgGilLHA",
    "https://lottiefiles.com/free-animation/pulse9809-6WEGJANeg5",
    "https://lottiefiles.com/free-animation/lock-butter-nGsVdcjxt5",
    "https://lottiefiles.com/free-animation/blue-wifi-QWTdsr8Zfa",
    "https://lottiefiles.com/free-animation/loogo-BOm33Rv3Kg",
    "https://lottiefiles.com/free-animation/animated-chat-ka95ftnDZo",
    "https://lottiefiles.com/free-animation/share-document-UQqpVLBm6g",
    "https://lottiefiles.com/free-animation/swipe-zIq7naPDmI",
    "https://lottiefiles.com/free-animation/transfer-data-n5BLasFH5V",
    "https://lottiefiles.com/free-animation/beat-3TQqNODcYM",
    "https://lottiefiles.com/free-animation/untitled-file-akvs7WyeEe",
    "https://lottiefiles.com/free-animation/bom-card-ZmfAWlaniJ",
    "https://lottiefiles.com/free-animation/circle-pulsing-while-fade-out-muqjHYAbZi",
    "https://lottiefiles.com/free-animation/marklo-byWQIBDu2E",
    "https://lottiefiles.com/free-animation/bonbon-omz67OGSI1",
    "https://lottiefiles.com/free-animation/loading-circle-ysefemkZ5j",
    "https://lottiefiles.com/free-animation/anima-bot-loss-final-xBN2ODtqLO",
    "https://lottiefiles.com/free-animation/store-widget-hiTKaDY72y"
];

const foundUrls = new Set();
const TIMEOUT = 5000;

function fetchUrl(url) {
    return new Promise((resolve) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }, timeout: TIMEOUT }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', (e) => {
            // console.error(e);
            resolve(null)
        });
    });
}

async function checkJson(url) {
    return new Promise((resolve) => {
        const req = https.request(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: TIMEOUT }, (res) => {
            if (res.statusCode === 200) resolve(true);
            else resolve(false);
        });
        req.on('error', () => resolve(false));
        req.on('timeout', () => req.destroy());
        req.end();
    });
}

async function processPage(pageUrl) {
    // console.log(`Scraping ${pageUrl}...`);
    const html = await fetchUrl(pageUrl);
    if (!html) {
        // console.log(`Failed to fetch ${pageUrl}`);
        return;
    }

    // Updated Pattern: find lottieUrl param in href
    // href="...lottieUrl=https%3A%2F%2Fassets-v2...&..."
    const matchUrl = html.match(/lottieUrl=([^&"]+)/);
    if (matchUrl) {
        let decoded = decodeURIComponent(matchUrl[1]);
        if (decoded.endsWith('.lottie')) {
            decoded = decoded.replace('.lottie', '.json');
        }
        // console.log(`Found candidate: ${decoded}`);
        if (await checkJson(decoded)) {
            foundUrls.add(decoded);
            process.stdout.write('.');
            return;
        }
    }

    // Fallback: Pattern 1 (old style)
    const match1 = html.match(/"lottieUrl"\s*:\s*"(https:\/\/[^"]+\.json)"/);
    if (match1) {
        let jsonUrl = match1[1].replace(/\\/g, '');
        if (await checkJson(jsonUrl)) {
            foundUrls.add(jsonUrl);
            process.stdout.write('.');
            return;
        }
    }

    // Pattern 2: direct https://assets...json
    const matches2 = html.match(/https:\/\/assets\d*\.lottiefiles\.com\/packages\/lf20_[a-zA-Z0-9_-]+\.json/g);
    if (matches2) {
        for (const m of matches2) {
            // console.log(`Found candidate 2: ${m}`);
            if (await checkJson(m)) {
                foundUrls.add(m);
                process.stdout.write('.');
            }
        }
    }
}

async function main() {
    console.warn(`Starting scrape...`);
    // Run in chunks
    for (let i = 0; i < URLS.length; i += 5) {
        const chunk = URLS.slice(i, i + 5);
        await Promise.all(chunk.map(processPage));
    }
    console.warn('\nDone.');
    console.log(JSON.stringify([...foundUrls], null, 2));
}

main();
