const BASE = 'https://raw.githubusercontent.com/spemer/lottie-animations-json/master/';
const PATHS = [
    'Favorite_Icon_Star/data.json',
    'Favorite Icon (Star)/data.json',
    'Page_Indicator/data.json',
    'Page Indicator/data.json',
    'Tab_Transition/data.json',
    'Tab Transition/data.json',
    'Floating_Action_Button/data.json',
    'Floating Action Button/data.json',
    'Pagination/data.json',
    'Star/data.json',
    'Tab/data.json',
    'FAB/data.json',
    'Menu/data.json',
    'Loading/data.json',
    'Success/data.json',
    'Error/data.json'
];

async function check(path) {
    const url = BASE + path;
    // Handle spaces in URL
    const encoded = encodeURI(url);
    try {
        const res = await fetch(encoded, { method: 'HEAD' });
        if (res.status === 200) console.log(encoded);
    } catch { }
}

async function main() {
    await Promise.all(PATHS.map(check));
}
main();
