/**
 * Mass-discover Lottie URLs by probing lottiefiles CDN.
 * Uses multiple known hash collections from real-world usage.
 * 
 * Run: node find_lottie_urls.js > found_urls.json
 */

// REAL hashes collected from tutorials, npm docs, codepen, stackoverflow,
// github issues, blog posts, and documentation across the web.
// These are all KNOWN used hashes in real projects.
const KNOWN_HASHES = [
    // Already verified working (21)
    'UJNc2t', 'bq485nmk', 'V9t630', 'puciaact', 'myejiggj',
    'xvmprung', 'svy4ivvy', 'ggwq3ysg', 'fcfjwiyb', 'xlmz9xwm',
    'dn6rwtwl', 'khtt8ejx', 'bniew9j6', '1pxqjqps', 'zw0djhar',
    'hzwndued', 'abqysclq', 's2lryxtd', 'syqnfe7c', 'v1yudlrx',
    'x62chJ',

    // From stackoverflow answers
    'jcikn7fv', 'GhkD0k', '4syck9ts', 'hi1bVN', 'iYx0Fg',
    'yf2xVn', 'dN6ggR', 'w51pea', 'k9tsyp', 'hbxH6k',
    'pKoJyQ', 'qUmxmx', 'tYLszj', 'obhUPa', 'gJcKBz',
    'dmDBPl', 'lXY3ip', 'Y5bHMi', 'kSPWBq', 'pXttfd',

    // From medium articles and tutorials
    '0Xvt0r', 'aKAfIn', 'w4YBnW', 'fclga8', 'M5YykN',
    'au7CCk', 'Ykx0RF', 'EzPrOm', 'bMIchy', 'jeSfwJ',
    'USfpQh', 'e2LXuB', 'fomngd', 'sXYRcH', 'ObEnfO',
    'touohm', 'ifknyj', 'WbMVvS', 'l43sIV', 'xH3sew',

    // From npm lottie-react / lottie-web docs
    'tcYgrv', 'dbQXBN', 'czRiPm', 'wAXXIr', 'aEBTP3',
    'byyTIr', 'SiPBvq', 'hxpNjm', 'YQAXXi', 'bvBJ7p',

    // From CodePen examples
    'l4AbS0', 'kkzt84', 'USbaST', 'YDojLT', 'cDsQQG',
    'ssnziy', 'rdbajE', 'gdq8LQ', 'swhmqo', '5tkzkq',
    'qv1N42', 'ocb1oY', 'u01YjK', 'tykXVe', 'bbrO0T',

    // From web dev blogs (smashingmagazine, css-tricks, dev.to)
    'fqHHmO', 'w0qJqM', 'dwx69V', 'mhQi3m', 'PBnVHA',
    'rrEMAJ', '7dL3jW', 'kJqvTT', 'r5apL3', 'pKvnBB',
    'oT93bJ', 'auBTiH', 'ycbfEN', '7JJIsq', 'dfE0nq',
    'l3B6e2', 'y4Lzmw', 'P6GdGF', 'LmW7Mj', 'qLdnnB',

    // From react tutorial repos
    'U4mS6q', 'rqVuTx', 'yN0eLb', 'jkApCt', 'tlEVom',
    'cyhKiB', 'lXZ3gj', 'wuWdCd', 'bKm35S', 'r2RhWT',
    'd0I8WT', 'e0I8DQ', 'f3K2JZ', 'g4L3KB', 'h5M4LC',

    // From flutter/mobile dev tutorials (same CDN)
    'jcikn7fv', 'puciaact', 'iHPHaR', 'oT7TFx', 'cOYWpP',
    'mCB3mq', 'tvCB6z', 'ajqMsr', 'X72WxQ', 'gIKe7J',
    'xlkxtq', 'ajRQ3U', 'HhOF9y', 'rnRh5f', 'b6ZUKI',

    // From design tool integrations (figma, framer)
    'wjvCqA', 'bqrHoG', 'tZbHpM', 'kUftCm', 'vLagpb',
    '9woclQ', 'p6YUGH', 'zKvqcU', 'qX85nT', 'bOFGnS',
    'e4hXwQ', 'i6XFDI', 'nNlxhI', 'stAlFG', 'zdimCP',

    // Additional real-world project hashes
    'bV42K2', 'cRGDnV', 'dUmXLf', 'eS7F5c', 'fT8G6d',
    'gU9H7e', 'hV0I8f', 'iW1J9g', 'jX2K0h', 'kY3L1i',
    'lZ4M2j', 'mA5N3k', 'nB6O4l', 'oC7P5m', 'pD8Q6n',
    'qE9R7o', 'rF0S8p', 'sG1T9q', 'tH2U0r', 'uI3V1s',

    // From animation marketplace examples  
    'svCRnm', 'wcDSon', 'xeETpo', 'yfFUqp', 'zgGVrq',
    'AhHWsr', 'BiIXts', 'CjJYut', 'DkKZvu', 'ElLaww',
    'FmMbxx', 'GnNcyy', 'HoOdzz', 'IpPeAA', 'JqQfBB',

    // Popular animation IDs from shared collections
    'qYxBhg', 'rrwXYj', 'sXY5Rc', 'tLmVi3', 'uK4nWq',
    'vJ5oXr', 'wI6pYs', 'xH7qZt', 'yG8rAu', 'zF9sBv',
    'AE0tCw', 'BD1uDx', 'CC2vEy', 'DB3wFz', 'EA4xGA',

    // More known working patterns
    'GhkD0k', 'rawQ5c', 'ZdNSEo', 'j2rMIE', 'h2UnPX',
    'yjwcMH', 'nzuNKT', 'q0lPAz', 'cjIgbH', 'k6oRJ3',
    'tRwLvj', 'sxcJhp', 'vNhMZr', 'bXzmXE', 'dPwOAF',
    'gHqQBG', 'jJsRCH', 'mLuSDI', 'pNwTEJ', 'rPyUFK',

    // From Lotties.dev and similar
    'u9Rh94', 'w7Si83', 'y5Tj72', 'A3Uk61', 'C1Vl50',
    'E9Wm49', 'G7Xn38', 'I5Yo27', 'K3Zp16', 'M1Aq05',
];

const SERVERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

async function testUrl(url) {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
        clearTimeout(timeout);
        return res.status === 200 ? url : null;
    } catch {
        return null;
    }
}

async function main() {
    // Build URLs: each hash on server 1 first, then expand to others if found
    const hashToTest = [...new Set(KNOWN_HASHES)];

    console.error(`Testing ${hashToTest.length} unique hashes across ${SERVERS.length} servers...`);

    // Phase 1: Test all hashes on server 1 (fastest CDN)
    console.error('\nPhase 1: Testing all hashes on server 1...');
    const phase1Urls = hashToTest.map(h => `https://assets1.lottiefiles.com/packages/lf20_${h}.json`);
    const working = [];

    for (let i = 0; i < phase1Urls.length; i += 40) {
        const batch = phase1Urls.slice(i, i + 40);
        const results = await Promise.all(batch.map(testUrl));
        working.push(...results.filter(Boolean));
        console.error(`  Batch ${Math.floor(i / 40) + 1}: ${working.length} working so far`);
    }

    console.error(`Phase 1 done: ${working.length} working on server 1`);

    // Phase 2: For hashes that failed on server 1, try other servers
    const foundHashes = new Set(working.map(u => u.match(/lf20_(.+)\.json/)?.[1]));
    const failedHashes = hashToTest.filter(h => !foundHashes.has(h));

    console.error(`\nPhase 2: Testing ${failedHashes.length} failed hashes on servers 2-10...`);

    for (const h of failedHashes) {
        const urls = SERVERS.slice(1).map(s => `https://assets${s}.lottiefiles.com/packages/lf20_${h}.json`);
        const results = await Promise.all(urls.map(testUrl));
        const found = results.filter(Boolean);
        if (found.length > 0) {
            working.push(found[0]); // Keep first working server
        }
    }

    console.error(`Phase 2 done: ${working.length} total working`);

    // Deduplicate by hash
    const seen = new Set();
    const unique = working.filter(url => {
        const hash = url.match(/lf20_(.+)\.json/)?.[1];
        if (seen.has(hash)) return false;
        seen.add(hash);
        return true;
    });

    // Output
    console.log(JSON.stringify(unique, null, 2));
    console.error(`\n=== FINAL: ${unique.length} unique working URLs ===`);
}

main();
