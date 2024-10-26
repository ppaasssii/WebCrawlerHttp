const {normalizeUrl, getURLsFromHTML} = require('./crawl.js');
const {test, expect} = require('@jest/globals');


test ('normalizeURL strip protocol', () => {
    const input = 'https://blog.boot.dev/path'
    const actual = normalizeUrl(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test ('normalizeURL strip trailing slash', () => {
    const input = 'https://blog.boot.dev/path/'
    const actual = normalizeUrl(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test ('normalizeURL capitals', () => {
    const input = 'https://BLOG.boot.dev/path/'
    const actual = normalizeUrl(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test ('normalizeURL strip http', () => {
    const input = 'http://blog.boot.dev/path/'
    const actual = normalizeUrl(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test ('getURLsFromHTML absolute', () => {
    // HTML body with a single link to the blog homepage
    const inputHTMLBody = `
<html>
    <body>
    
        <a href="https://blog.boot.dev/"> 
            Boot.dev Blog
        </a>
    </body>
</html>   
    `
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["https://blog.boot.dev/"]
    expect(actual).toEqual(expected)
})

test ('getURLsFromHTML relative', () => {
    // HTML body with a single link to the blog homepage
    const inputHTMLBody = `
<html>
    <body>
    
        <a href="/path/"> 
            Boot.dev Blog
        </a>
    </body>
</html>   
    `
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["https://blog.boot.dev/path/"]
    expect(actual).toEqual(expected)
})

test ('getURLsFromHTML absolute and relative', () => {

    // HTML body with a single link to the blog homepage
    const inputHTMLBody = `
<html>
    <body>
        <a href="https://blog.boot.dev/path1/"> //absolute
            Boot.dev Blog Path One
        </a>
        <a href="/path2/"> //relative
            Boot.dev Blog Two
        </a>
    </body>
</html>   
    `
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ["https://blog.boot.dev/path1/", "https://blog.boot.dev/path2/"]
    expect(actual).toEqual(expected)
})

test ('getURLsFromHTML invalid', () => {
    // HTML body with a single link to the blog homepage
    const inputHTMLBody = `
<html>
    <body>
    
        <a href="invalid"> 
            Invalid URL
        </a>
    </body>
</html>   
    `
    const inputBaseURL = "https://blog.boot.dev"
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = []
    expect(actual).toEqual(expected)
})