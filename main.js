const { crawlPage } = require('./crawl.js');
const { printAndSaveReport } = require('./report.js');

/**
 * Main function to start the web crawling process.
 *
 * This function checks the command line arguments to ensure exactly one website URL is provided.
 * It then starts the crawling process for the given URL and generates a report.
 */
async function main() {
    if (process.argv.length < 3) { // process.argv is an array that contains the command line arguments
        console.log('no website provided');
        process.exit(1);
    }
    if (process.argv.length > 3) {
        console.log("too many command input arguments (only one website allowed)");
        process.exit(1);
    }
    const baseURL = process.argv[2];

    console.log(`Start crawling of ${baseURL}`);
    const pages = await crawlPage(baseURL, baseURL, {});

    printAndSaveReport(pages);
}

main();