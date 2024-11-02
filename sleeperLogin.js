const puppeteer = require('puppeteer');
const {timeout} = require("puppeteer-core");

const sleeperLoginURL = 'https://sleeper.app/login';

const randomUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3';

const username = '';
const password = '';

// Encode the username and password in Base64
const encodedCredentials = Buffer.from(`${username}:${password}`).toString('base64');

const requestHeaders = {
    'referer': 'www.google.com',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'max-age=0',
    'accept-encoding': 'gzip, deflate, br',
    'Authorization': `Basic ${encodedCredentials}`,
    'user-agent': randomUserAgent,
};

async function initializeBrowser() {
    const browser = await puppeteer.launch({
        headless: false // Set to true for headless mode, false for non-headless
    });
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({...requestHeaders});
    await page.goto(sleeperLoginURL);

    return page;
}

async function insertEmail() {

    const loginPageEmail = await initializeBrowser();
    //email or phone
    await loginPageEmail.waitForSelector('input[placeholder="Enter email, phone, or username"]');
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1001) + 1000));//random delay between 1 and 2 seconds
    await loginPageEmail.type('input[placeholder="Enter email, phone, or username"]', `${username}`);
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1001) + 1000));
    await loginPageEmail.click('div[class="app-button-gradient login-button"]');

    return loginPageEmail;
}

async function insertPassword() {
    const loginPagePassword = await insertEmail();
    let cookieWindowResolved = true;
    try {
        await loginPagePassword.waitForSelector('#onetrust-accept-btn-handler', timeout(Math.floor(Math.random() * 1001) + 1000));
        await loginPagePassword.click('#onetrust-accept-btn-handler');
    } catch (error) {
        console.log('Cookie window did not appear.');
        cookieWindowResolved = false;
    }
    await loginPagePassword.waitForSelector('input[placeholder="Enter password"]');

    if (!cookieWindowResolved) {
        try {
            await loginPagePassword.waitForSelector('#onetrust-accept-btn-handler', timeout(Math.floor(Math.random() * 1001) + 1000));
            await loginPagePassword.click('#onetrust-accept-btn-handler');
        } catch (error) {
            console.log('Cookie window did not appear.');
            cookieWindowResolved = false;
        }
    }
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1001) + 1000));
    await loginPagePassword.type('input[placeholder="Enter password"]', `${password}`);
    await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 1001) + 1000));
    await loginPagePassword.click('div[class="app-button-gradient login-button"]');

    return loginPagePassword;
}

insertPassword();