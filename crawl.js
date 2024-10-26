function normalizeUrl(urlString){
    // URL is a built-in class in Node.js
    const urlObj = new URL(urlString)
    // hostname is the domain name, pathname is the path after the domain name
    const hostPath = `${urlObj.hostname}${urlObj.pathname}`

    // if the last character is a slash '/', remove
    if (hostPath.length > 0 && hostPath.slice(-1) === '/'){
        // slice(0, -1) means everything except the last character
       return hostPath.slice(0, -1)
    }
    else
        return hostPath
}

module.exports = {
    normalizeUrl
}