/**
 * ============================================================
 *  CDN Audit Trail Script
 *  Checks all public CDN URLs used by the Scrolla app.
 *  - Validates existing Lottie JSON URLs (HTTP status + valid JSON)
 *  - Validates Picsum image endpoint
 *  - Discovers new working Lottie URLs from the full registry
 *  - Generates a report + a clean verified URL list
 * ============================================================
 *
 *  Usage:  node cdn_audit.js
 *  Output: cdn_audit_report.json  (full report)
 *          verified_lottie_urls.json (clean list for app use)
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ── URLs currently used in the app ──────────────────────────
const APP_LOTTIE_URLS = [
  "https://assets1.lottiefiles.com/packages/lf20_qp1q7mct.json",
  "https://assets1.lottiefiles.com/packages/lf20_inti4oxf.json",
  "https://assets1.lottiefiles.com/packages/lf20_poqmycwy.json",
  "https://assets1.lottiefiles.com/packages/lf20_cwA7Cn.json",
  "https://assets1.lottiefiles.com/packages/lf20_UJNc2t.json",
  "https://assets1.lottiefiles.com/packages/lf20_bq485nmk.json",
  "https://assets1.lottiefiles.com/packages/lf20_V9t630.json",
  "https://assets1.lottiefiles.com/packages/lf20_puciaact.json",
];

// ── Full registry from visual/src/utils/lottieRegistry.js ───
const FULL_LOTTIE_REGISTRY = [
  // Abstract & Geometric
  "https://assets1.lottiefiles.com/packages/lf20_UJNc2t.json",
  "https://assets1.lottiefiles.com/packages/lf20_bq485nmk.json",
  "https://assets1.lottiefiles.com/packages/lf20_V9t630.json",
  "https://assets1.lottiefiles.com/packages/lf20_puciaact.json",
  "https://assets1.lottiefiles.com/packages/lf20_myejiggj.json",
  "https://assets1.lottiefiles.com/packages/lf20_xvmprung.json",
  "https://assets1.lottiefiles.com/packages/lf20_svy4ivvy.json",
  "https://assets1.lottiefiles.com/packages/lf20_ggwq3ysg.json",
  "https://assets1.lottiefiles.com/packages/lf20_fcfjwiyb.json",
  "https://assets1.lottiefiles.com/packages/lf20_xlmz9xwm.json",
  "https://assets1.lottiefiles.com/packages/lf20_dn6rwtwl.json",
  "https://assets1.lottiefiles.com/packages/lf20_khtt8ejx.json",
  "https://assets1.lottiefiles.com/packages/lf20_bniew9j6.json",
  "https://assets1.lottiefiles.com/packages/lf20_1pxqjqps.json",
  "https://assets1.lottiefiles.com/packages/lf20_zw0djhar.json",
  "https://assets1.lottiefiles.com/packages/lf20_hzwndued.json",
  "https://assets1.lottiefiles.com/packages/lf20_abqysclq.json",
  "https://assets1.lottiefiles.com/packages/lf20_s2lryxtd.json",
  "https://assets1.lottiefiles.com/packages/lf20_syqnfe7c.json",
  "https://assets1.lottiefiles.com/packages/lf20_v1yudlrx.json",
  "https://assets1.lottiefiles.com/packages/lf20_x62chJ.json",
  "https://assets1.lottiefiles.com/packages/lf20_GhkD0k.json",
  "https://assets1.lottiefiles.com/packages/lf20_4syck9ts.json",
  // Wave / Flow / Organic
  "https://assets1.lottiefiles.com/packages/lf20_jR229r.json",
  "https://assets1.lottiefiles.com/packages/lf20_kyu7xb1v.json",
  "https://assets1.lottiefiles.com/packages/lf20_u4jjb9bd.json",
  "https://assets1.lottiefiles.com/packages/lf20_vPnn3K.json",
  "https://assets1.lottiefiles.com/packages/lf20_jcikwtux.json",
  "https://assets1.lottiefiles.com/packages/lf20_w51pcehl.json",
  "https://assets1.lottiefiles.com/packages/lf20_UdIDHC.json",
  "https://assets1.lottiefiles.com/packages/lf20_obhph3sh.json",
  "https://assets1.lottiefiles.com/packages/lf20_i9mxcD.json",
  "https://assets1.lottiefiles.com/packages/lf20_p8bfn5to.json",
  "https://assets1.lottiefiles.com/packages/lf20_mbrocy0r.json",
  // Space / Stars / Cosmic
  "https://assets1.lottiefiles.com/packages/lf20_XZ3pkn.json",
  "https://assets1.lottiefiles.com/packages/lf20_xlkxtmul.json",
  "https://assets1.lottiefiles.com/packages/lf20_szlepvdh.json",
  "https://assets1.lottiefiles.com/packages/lf20_cbrbre30.json",
  // Particles / Bubbles
  "https://assets1.lottiefiles.com/packages/lf20_poqmycwy.json",
  "https://assets1.lottiefiles.com/packages/lf20_cwA7Cn.json",
  "https://assets1.lottiefiles.com/packages/lf20_ystsffqy.json",
  "https://assets1.lottiefiles.com/packages/lf20_zlrpnoxz.json",
  // Liquid / Gradient
  "https://assets1.lottiefiles.com/packages/lf20_rbtawnwz.json",
  "https://assets1.lottiefiles.com/packages/lf20_oyi9a28g.json",
  "https://assets1.lottiefiles.com/packages/lf20_xyadoh9h.json",
  "https://assets1.lottiefiles.com/packages/lf20_usmfx6bp.json",
  // Tech / Data
  "https://assets1.lottiefiles.com/packages/lf20_qp1q7mct.json",
  "https://assets1.lottiefiles.com/packages/lf20_inti4oxf.json",
  // GitHub Repos
  "https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/adrock/data.json",
  "https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/bodymovin/data.json",
  "https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/gatin/data.json",
  "https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/happy2016/data.json",
  "https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/navidad/data.json",
  // V2 CDN
  "https://assets-v2.lottiefiles.com/a/50198a34-9c22-4b2d-a3ce-98d88bed82a8/pARybextv7.json",
];

const PICSUM_TEST_URLS = [
  "https://picsum.photos/seed/12345/800/1200",
  "https://picsum.photos/seed/99999/800/1200",
  "https://picsum.photos/seed/77777/800/1200",
];

// ── Helpers ─────────────────────────────────────────────────

function fetchHead(url, timeoutMs = 8000) {
  return new Promise((resolve) => {
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, { timeout: timeoutMs }, (res) => {
      // Consume body to free socket
      res.resume();
      resolve({
        url,
        status: res.statusCode,
        contentType: res.headers['content-type'] || '',
        ok: res.statusCode >= 200 && res.statusCode < 400,
      });
    });
    req.on('error', (err) => resolve({ url, status: 0, contentType: '', ok: false, error: err.message }));
    req.on('timeout', () => { req.destroy(); resolve({ url, status: 0, contentType: '', ok: false, error: 'TIMEOUT' }); });
  });
}

function fetchJSON(url, timeoutMs = 10000) {
  return new Promise((resolve) => {
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, { timeout: timeoutMs, headers: { 'Accept': 'application/json' } }, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchJSON(res.headers.location, timeoutMs).then(resolve);
        res.resume();
        return;
      }

      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        let validJson = false;
        let hasLottieKeys = false;
        try {
          const parsed = JSON.parse(body);
          validJson = true;
          // Check for Lottie-specific keys
          hasLottieKeys = !!(parsed.v || parsed.fr || parsed.layers || parsed.assets);
        } catch (e) { /* not valid JSON */ }

        resolve({
          url,
          status: res.statusCode,
          ok: res.statusCode === 200,
          validJson,
          hasLottieKeys,
          sizeBytes: Buffer.byteLength(body),
        });
      });
    });
    req.on('error', (err) => resolve({ url, status: 0, ok: false, validJson: false, hasLottieKeys: false, sizeBytes: 0, error: err.message }));
    req.on('timeout', () => { req.destroy(); resolve({ url, status: 0, ok: false, validJson: false, hasLottieKeys: false, sizeBytes: 0, error: 'TIMEOUT' }); });
  });
}

function dedup(arr) { return [...new Set(arr)]; }

// ── Main ────────────────────────────────────────────────────

async function main() {
  const startTime = Date.now();
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║       🔍 SCROLLA CDN AUDIT TRAIL                ║');
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');

  // ──────────────────────────────────────────────────────────
  // PHASE 1: Validate existing app Lottie URLs
  // ──────────────────────────────────────────────────────────
  console.log('━━━ PHASE 1: Validating existing app Lottie URLs ━━━');
  const appResults = [];
  for (const url of APP_LOTTIE_URLS) {
    process.stdout.write(`  Checking ${url.split('/').pop()} ... `);
    const result = await fetchJSON(url);
    const icon = result.ok && result.validJson && result.hasLottieKeys ? '✅' : '❌';
    console.log(`${icon}  HTTP ${result.status} | JSON: ${result.validJson} | Lottie: ${result.hasLottieKeys} | ${(result.sizeBytes / 1024).toFixed(1)}KB`);
    appResults.push({ ...result, inApp: true });
  }

  const appAlive = appResults.filter(r => r.ok && r.validJson && r.hasLottieKeys);
  const appDead = appResults.filter(r => !(r.ok && r.validJson && r.hasLottieKeys));
  console.log(`\n  Summary: ${appAlive.length}/${APP_LOTTIE_URLS.length} currently in app are alive.\n`);

  // ──────────────────────────────────────────────────────────
  // PHASE 2: Scan full registry for new working URLs
  // ──────────────────────────────────────────────────────────
  console.log('━━━ PHASE 2: Scanning full Lottie registry ━━━');
  const allUrls = dedup(FULL_LOTTIE_REGISTRY);
  const newCandidates = allUrls.filter(u => !APP_LOTTIE_URLS.includes(u));
  console.log(`  Total unique URLs in registry: ${allUrls.length}`);
  console.log(`  Already in app: ${APP_LOTTIE_URLS.length}`);
  console.log(`  New candidates to test: ${newCandidates.length}\n`);

  const registryResults = [];
  for (const url of newCandidates) {
    process.stdout.write(`  Testing ${url.split('/').pop()} ... `);
    const result = await fetchJSON(url);
    const icon = result.ok && result.validJson && result.hasLottieKeys ? '✅' : '❌';
    console.log(`${icon}  HTTP ${result.status} | JSON: ${result.validJson} | Lottie: ${result.hasLottieKeys} | ${(result.sizeBytes / 1024).toFixed(1)}KB`);
    registryResults.push(result);
  }

  const newAlive = registryResults.filter(r => r.ok && r.validJson && r.hasLottieKeys);
  const newDead = registryResults.filter(r => !(r.ok && r.validJson && r.hasLottieKeys));
  console.log(`\n  New working URLs discovered: ${newAlive.length}/${newCandidates.length}\n`);

  // ──────────────────────────────────────────────────────────
  // PHASE 3: Validate Picsum image endpoints
  // ──────────────────────────────────────────────────────────
  console.log('━━━ PHASE 3: Validating Picsum image API ━━━');
  const picResults = [];
  for (const url of PICSUM_TEST_URLS) {
    process.stdout.write(`  Testing ${url} ... `);
    const result = await fetchHead(url);
    const icon = result.ok ? '✅' : '❌';
    console.log(`${icon}  HTTP ${result.status} | Content-Type: ${result.contentType}`);
    picResults.push(result);
  }
  const picAlive = picResults.filter(r => r.ok);
  console.log(`\n  Picsum status: ${picAlive.length}/${PICSUM_TEST_URLS.length} endpoints alive.\n`);

  // ──────────────────────────────────────────────────────────
  // PHASE 4: Generate outputs
  // ──────────────────────────────────────────────────────────
  const verifiedUrls = [
    ...appAlive.map(r => r.url),
    ...newAlive.map(r => r.url),
  ];

  const report = {
    generated_at: new Date().toISOString(),
    duration_ms: Date.now() - startTime,
    summary: {
      app_urls_tested: APP_LOTTIE_URLS.length,
      app_urls_alive: appAlive.length,
      app_urls_dead: appDead.length,
      registry_candidates_tested: newCandidates.length,
      registry_new_alive: newAlive.length,
      registry_dead: newDead.length,
      total_verified_lottie_urls: verifiedUrls.length,
      picsum_endpoints_alive: picAlive.length,
    },
    dead_urls: [
      ...appDead.map(r => ({ url: r.url, status: r.status, error: r.error || 'Invalid response', was_in_app: true })),
      ...newDead.map(r => ({ url: r.url, status: r.status, error: r.error || 'Invalid response', was_in_app: false })),
    ],
    verified_lottie_urls: verifiedUrls,
    picsum_results: picResults,
  };

  // Write report
  const reportPath = path.join(__dirname, 'cdn_audit_report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`━━━ REPORT SAVED ━━━`);
  console.log(`  📄 ${reportPath}`);

  // Write clean verified list
  const verifiedPath = path.join(__dirname, 'verified_lottie_urls.json');
  fs.writeFileSync(verifiedPath, JSON.stringify(verifiedUrls, null, 2));
  console.log(`  📄 ${verifiedPath}`);

  // ──────────────────────────────────────────────────────────
  // PHASE 5: Final Summary
  // ──────────────────────────────────────────────────────────
  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║               FINAL AUDIT SUMMARY               ║');
  console.log('╠══════════════════════════════════════════════════╣');
  console.log(`║  Lottie (in app)   :  ${String(appAlive.length).padStart(2)} alive / ${String(appDead.length).padStart(2)} dead        ║`);
  console.log(`║  Lottie (new found):  ${String(newAlive.length).padStart(2)} alive / ${String(newDead.length).padStart(2)} dead        ║`);
  console.log(`║  Total verified    :  ${String(verifiedUrls.length).padStart(2)} URLs ready            ║`);
  console.log(`║  Picsum images     :  ${String(picAlive.length).padStart(2)} alive / ${String(picResults.length - picAlive.length).padStart(2)} dead        ║`);
  console.log(`║  Duration          :  ${((Date.now() - startTime) / 1000).toFixed(1)}s                      ║`);
  console.log('╚══════════════════════════════════════════════════╝');

  if (appDead.length > 0) {
    console.log('\n⚠️  ACTION REQUIRED: Remove dead URLs from LottieBackground.js:');
    appDead.forEach(r => console.log(`   ❌ ${r.url}`));
  }

  if (newAlive.length > 0) {
    console.log(`\n💡 ${newAlive.length} new verified URLs can be added to LottieBackground.js.`);
    console.log('   See verified_lottie_urls.json for the full list.');
  }
}

main().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
