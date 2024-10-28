const { crawlPage } = require('./crawl.js')

function main () {
    if (process.argv.length < 3) {        // process.argv is an array that contains the command line arguments
        console.log('no website provided')
        process.exit(1)
  }
    if (process.argv.length > 3) {
        console.log("too many command input arguments (only one website allowed)")
        process.exit(1)
    }
    const baseURL = process.argv[2]

    console.log(`Craaawwwwliiing in the deeeeehhheeeeep of ${baseURL}`)
    crawlPage(baseURL)
}

main()
