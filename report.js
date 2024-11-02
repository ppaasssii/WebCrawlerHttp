const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Prints a report of the pages and saves it as an Excel file.
 *
 * @param {Object} pages - An object where the keys are URLs and the values are the number of hits.
 */
function printAndSaveReport(pages) {
    console.log('================');
    console.log('REPORT');
    console.log('================');
    const sortedPages = sortPages(pages);
    for (const sortedPage of sortedPages) {
        const url = sortedPage[0];
        const hits = sortedPage[1];
        console.log(`Found ${hits} links to page: ${url}`);
    }

    const folderPath = path.join(os.homedir(), 'Documents', 'WebCrawlerReports'); // create a folder "WebCrawler Reports" under downloads if it does not exist and save the file there
    try {
        fs.mkdirSync(folderPath);
    } catch (error) {
        if (error.code !== 'EEXIST') {
            console.error(`Error creating folder: ${error.message}`);
            throw error;
        }
    }

    const worksheet = xlsx.utils.aoa_to_sheet([['URL', 'Hits'], ...sortedPages]); // create a worksheet
    const workbook = xlsx.utils.book_new(); // create a new workbook
    const baseURL = process.argv[2];
    const reportTS = new Date().toISOString(); // create a timestamp for the report
    const fileName = `${reportTS}_${baseURL.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '')}_report.xlsx`;
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Report');
    xlsx.writeFile(workbook, `${folderPath}/${fileName}`);

    console.log('================');
    console.log(`Report saved to: ${folderPath}/${fileName}`);
    console.log('REPORT END');
    console.log('================');
}

/**
 * Sorts the pages by the number of hits in descending order.
 *
 * @param {Object} pages - An object where the keys are URLs and the values are the number of hits.
 * @returns {Array} An array of arrays, where each inner array contains a URL and the number of hits.
 */
function sortPages(pages) {
    const pagesArr = Object.entries(pages);
    pagesArr.sort((a, b) => {
        const aHits = a[1];
        const bHits = b[1];
        return bHits - aHits;
    });
    return pagesArr;
}

module.exports = {
    sortPages,
    printAndSaveReport
};