import { chromium } from 'playwright';

const testOne = async (configs) => {
    const browser = await chromium.launch(configs);
    const page = await browser.newPage();
    const results = [];
    const filename = 'testOne'; // No .js extension
    const url = 'https://adentran.vercel.app/';
    try {
        await page.goto(url);
        await page.waitForTimeout(3000); // Wait for 3 seconds after page load
        const text = await page.textContent('//*[@id="root"]/main/div[3]/div[1]/div[1]/div/h1');
        results.push({
            test: filename,
            url,
            expected: "Hi, I'm Aden.",
            actual: text,
            pass: text === "Hi, I'm Aden.",
            type: "UI",
        });
    } catch (error) {
        results.push({
            test: filename,
            url,
            expected: "No Error",
            actual: error.message,
            pass: false,
            type: "UI",
        });
    } finally {
        await page.close();
        await browser.close();
        return results;
    }
};

export default testOne;