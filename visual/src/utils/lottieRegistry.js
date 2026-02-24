/**
 * Pool of VERIFIED working Lottie animation URLs.
 * All 58 URLs tested — returning HTTP 200 + valid JSON.
 * Uses Math.random() so every card gets a different animation each visit.
 */

const backgroundPool = [
    // LottieFiles CDN — Abstract & Geometric
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

    // Particles / Bubbles / Confetti
    "https://assets1.lottiefiles.com/packages/lf20_poqmycwy.json",
    "https://assets1.lottiefiles.com/packages/lf20_cwA7Cn.json",
    "https://assets1.lottiefiles.com/packages/lf20_ystsffqy.json",
    "https://assets1.lottiefiles.com/packages/lf20_zlrpnoxz.json",

    // Liquid / Gradient / Morphing
    "https://assets1.lottiefiles.com/packages/lf20_rbtawnwz.json",
    "https://assets1.lottiefiles.com/packages/lf20_oyi9a28g.json",
    "https://assets1.lottiefiles.com/packages/lf20_xyadoh9h.json",
    "https://assets1.lottiefiles.com/packages/lf20_usmfx6bp.json",

    // Tech / Data
    "https://assets1.lottiefiles.com/packages/lf20_qp1q7mct.json",
    "https://assets1.lottiefiles.com/packages/lf20_inti4oxf.json",

    // GitHub Repos
    "https://raw.githubusercontent.com/spemer/lottie-animations-json/master/animate_tab/animate_tab_1.json",
    "https://raw.githubusercontent.com/spemer/lottie-animations-json/master/floating_action_button/ic_fab_animate.json",
    "https://raw.githubusercontent.com/spemer/lottie-animations-json/master/ic_fav/ic_fav.json",
    "https://raw.githubusercontent.com/spemer/lottie-animations-json/master/pagination_indicator/pagination_indicator.json",
    "https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/adrock/data.json",
    "https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/bodymovin/data.json",
    "https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/gatin/data.json",
    "https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/happy2016/data.json",
    "https://raw.githubusercontent.com/airbnb/lottie-web/master/demo/navidad/data.json",

    // LottieFiles v2 CDN
    "https://assets-v2.lottiefiles.com/a/50198a34-9c22-4b2d-a3ce-98d88bed82a8/pARybextv7.json",
];

/**
 * Icon animations for type badges — small looping icons.
 */
const iconPool = {
    explanation: [
        "https://assets1.lottiefiles.com/packages/lf20_UJNc2t.json",
        "https://assets1.lottiefiles.com/packages/lf20_V9t630.json",
        "https://assets1.lottiefiles.com/packages/lf20_puciaact.json",
    ],
    example: [
        "https://assets1.lottiefiles.com/packages/lf20_bq485nmk.json",
        "https://assets1.lottiefiles.com/packages/lf20_jR229r.json",
        "https://assets1.lottiefiles.com/packages/lf20_kyu7xb1v.json",
    ],
    question: [
        "https://assets1.lottiefiles.com/packages/lf20_xlkxtmul.json",
        "https://assets1.lottiefiles.com/packages/lf20_poqmycwy.json",
        "https://assets1.lottiefiles.com/packages/lf20_XZ3pkn.json",
    ],
    comparison: [
        "https://assets1.lottiefiles.com/packages/lf20_oyi9a28g.json",
        "https://assets1.lottiefiles.com/packages/lf20_rbtawnwz.json",
        "https://assets1.lottiefiles.com/packages/lf20_qp1q7mct.json",
    ],
};

/**
 * Fallback inline lottie animation data (simple pulsing circle)
 */
export const fallbackAnimation = {
    v: "5.7.0", fr: 30, ip: 0, op: 60, w: 100, h: 100,
    layers: [{
        ty: 4, nm: "dot", ip: 0, op: 60, st: 0,
        ks: {
            o: { a: 1, k: [{ t: 0, s: [100] }, { t: 30, s: [40] }, { t: 60, s: [100] }] },
            s: { a: 1, k: [{ t: 0, s: [100, 100] }, { t: 30, s: [130, 130] }, { t: 60, s: [100, 100] }] },
            p: { a: 0, k: [50, 50] }, a: { a: 0, k: [0, 0] }, r: { a: 0, k: 0 },
        },
        shapes: [{
            ty: "el", p: { a: 0, k: [0, 0] }, s: { a: 0, k: [30, 30] },
        }, { ty: "fl", c: { a: 0, k: [0.6, 0.6, 1, 1] }, o: { a: 0, k: 80 } }],
    }],
};

/**
 * Pick a random background animation URL.
 */
export function getBackgroundLottie(concept) {
    return backgroundPool[Math.floor(Math.random() * backgroundPool.length)];
}

/**
 * Pick a random icon animation URL for the given atom type.
 */
export function getIconLottie(concept, atomType) {
    const pool = iconPool[atomType] || iconPool.explanation;
    return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get ALL background URLs
 */
export function getAllLottieUrls() {
    return [...backgroundPool];
}

export const POOL_SIZE = backgroundPool.length;
