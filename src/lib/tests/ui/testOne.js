import { chromium } from 'playwright';

const testOne = async (configs) => {
    const start = Date.now();
    const browser = await chromium.launch(configs);
    const page = await browser.newPage();
    const results = [];
    const filename = 'testOne';
    const url = 'https://adentran.vercel.app/';
    const selector = '//*[@id="root"]/main/div[3]/div[1]/div[1]/div/h1';
    const expected = "Hi, I'm Aden.";
    const description = `Validating that the main heading contains '${expected}'`;

    try {
        await page.goto(url);
        await page.waitForTimeout(3000);
        const now = Date.now();
        const actual = await page.textContent(selector);
        const pass = actual === expected;
        let screenshotBase64;
        if (!pass) {
            const buffer = await page.screenshot();
            screenshotBase64 = buffer.toString('base64');
        }
        const duration = now - start;
        results.push({
            test: filename,
            url,
            description,
            expected,
            actual,
            pass,
            type: "UI",
            duration,
            ...(screenshotBase64 && { screenshotBase64 }),
        });
    } catch (error) {
        const now = Date.now();
        const buffer = await page.screenshot();
        const screenshotBase64 = buffer.toString('base64');
        const duration = now - start;
        results.push({
            test: filename,
            url,
            description: "Catching any unexpected error during the UI test.",
            expected: "No Error",
            actual: error.message,
            pass: false,
            type: "UI",
            duration,
            screenshotBase64,
        });
    } finally {
        await page.close();
        await browser.close();
        return results;
    }
};

export default testOne;