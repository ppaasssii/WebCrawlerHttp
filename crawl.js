const { JSDOM } = require('jsdom');

/**
 * Crawls a web page and collects URLs.
 *
 * @param {string} baseUrl - The base URL of the website being crawled.
 * @param {string} currentURL - The current URL being crawled.
 * @param {Object} pages - An object to store the URLs and their counts.
 * @returns {Object} The updated pages object with URLs and their counts.
 */
async function crawlPage(baseUrl, currentURL, pages) {
    const baseURLObj = new URL(baseUrl);
    const currentURLObj = new URL(currentURL);
    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages;
    }

    const normalizedURL = normalizeUrl(currentURL);
    if (pages[normalizedURL] > 0) {
        pages[normalizedURL]++;
        return pages;
    }

    pages[normalizedURL] = 1;
    console.log(`Actively crawling ${currentURL}`);

    try {
        const response = await fetch(currentURL);
        if (response.status > 399) {
            console.log(`Error fetching URL with status code: ${response.status} - ${response.statusText}, on page: ${currentURL}`);
            return pages;
        }

        const contentType = response.headers.get("content-type");
        if (!contentType.includes("text/html")) {
            console.log(`non-HTML response of type ${contentType}, on page: ${currentURL}`);
            return pages;
        }

        const htmlBody = await response.text();
        const nextURLs = getURLsFromHTML(htmlBody, baseUrl);

        for (const nextURL of nextURLs) {
            pages = await crawlPage(baseUrl, nextURL, pages);
        }
    } catch (error) {
        console.log(`Error fetching URL: ${error.message}, on page: ${currentURL}`);
    }
    return pages;
}

/**
 * Extracts URLs from an HTML body.
 *
 * @param {string} htmlBody - The HTML content of the page.
 * @param {string} baseURL - The base URL to resolve relative URLs.
 * @returns {Array} An array of extracted URLs.
 */
function getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');

    for (const linkElement of linkElements) {
        if (linkElement.href.startsWith('/')) {
            try {
                const urlObj = new URL(`${baseURL}${linkElement.href}`);
                urls.push(urlObj.href);
            } catch (error) {
                console.log(`Error Invalid relative URL: ${error.message}`);
            }
        } else {
            try {
                const urlObj = new URL(linkElement.href);
                urls.push(urlObj.href);
            } catch (error) {
                console.log(`Error Invalid absolute URL: ${error.message}`);
            }
        }
    }
    return urls;
}

/**
 * Normalizes a URL by removing the protocol and trailing slash.
 *
 * @param {string} urlString - The URL to be normalized.
 * @returns {string} The normalized URL.
 */
function normalizeUrl(urlString) {
    const urlObj = new URL(urlString);
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`;

    if (hostPath.length > 0 && hostPath.endsWith('/')) {
        return hostPath.slice(0, -1);
    } else {
        return hostPath;
    }
}

module.exports = {
    normalizeUrl,
    getURLsFromHTML,
    crawlPage
};