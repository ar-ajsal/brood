const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkConsole() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();

  page.on('console', msg => console.log('[BROWSER LOG]', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('[BROWSER ERROR]', err.toString()));

  await page.goto('http://localhost:3000/shop', { waitUntil: 'networkidle2' });
  await browser.close();
}

checkConsole();
