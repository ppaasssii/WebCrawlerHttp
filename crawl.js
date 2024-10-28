const {JSDOM} = require('jsdom')

async function crawlPage(currentURL) {
    console.log(`Actively crawling ${currentURL}`)
    try {
        const response = await fetch(currentURL) // fetch is a built-in function in Node.js that allows us to make HTTP requests

        if (response.status > 399){
            console.log(`Error fetching URL with status code: ${response.status} - ${response.statusText}, on page: ${currentURL}`)
            return
        }

        const contentType= response.headers.get('content-type')
        if(!contentType || !contentType.includes('text/html')) {
            console.log(`non-HTML response of type ${contentType}, on page: ${currentURL}`)
            return
        }

        console.log(await response.text())
    } catch (error){
        console.log(`Error fetching URL: ${error.message}, on page: ${currentURL}`)
    }

}

function getURLsFromHTML(htmlBody, baseURL){
    const urls = []
    const dom = new JSDOM(htmlBody) // JSDOM is a library that allows us to parse HTML
    const linkElements = dom.window.document.querySelectorAll('a') // querySelectorAll returns a NodeList, which is similar to an array

    for ( const linkElement of linkElements){  // iterate over the NodeList and extract the href attribute
        if (linkElement.href.startsWith('/')){
            //relative
            try {
                const urlObj = new URL(`${baseURL}${linkElement.href}`)  // concatenate the base URL with the relative path
                urls.push(urlObj.href)
            } catch (error){
                console.log(`Error Invalid relative URL: ${error.message}`)
            }
        } else {
            //absolute
            try {
                const urlObj = new URL(linkElement.href) // concatenate the base URL with the relative path
                urls.push(urlObj.href)
            } catch (error){
                console.log(`Error Invalid absolute URL: ${error.message}`)
            }
        }
    }
    return urls
}


function normalizeUrl(urlString){
    const urlObj = new URL(urlString) // URL is a built-in class in Node.js that allows us to parse URLs
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`// hostname is the domain name, pathname is the path after the domain name

    if (hostPath.length > 0 && hostPath.endsWith('/')){     // if the last character is a slash '/', remove
       return hostPath.slice(0, -1) // slice(0, -1) means everything except the last character
    }
    else
        return hostPath
}

module.exports = {
    normalizeUrl,
    getURLsFromHTML,
    crawlPage
}