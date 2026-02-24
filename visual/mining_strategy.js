/**
 * Mines Lottie URLs from web search snippets.
 * Searches coding sites (CodeSandbox, CodePen, GitHub, etc.) for "lottiefiles" strings.
 * Extracts "lf20_xxxx" hashes from the textual results.
 * Tests if they are valid working URLs.
 */

// Tools wrapper to run search_web
const TOOLS = {
    search: async (query) => {
        // This script doesn't actually run the tool, it just defines the logic 
        // for the agent to follow. The agent will run the search tools manually.
        // So this file is just a placeholder to explain the strategy.
        return [];
    }
};

/**
 * STRATEGY:
 * 1. The agent will run search_web() for multiple queries.
 * 2. The agent will parse the OUTPUT of those tool calls (the snippets).
 * 3. The agent will extract anything looking like `lf20_[a-zA-Z0-9]+`.
 * 4. The agent will add them to a list and test them using the `find_lottie_urls.js` tester.
 */

console.log("This script is a strategy guide. Please run the search_web tool with the following queries:");
console.log(`
site:codepen.io "assets" "lottiefiles.com" json
site:codesandbox.io "assets" "lottiefiles.com" json
site:github.com "assets" "lottiefiles.com" "lf20_"
site:stackoverflow.com "assets" "lottiefiles.com" "lf20_"
site:npm.im "lottiefiles" json
"https://assets" "lottiefiles.com/packages/lf20_"
`);
