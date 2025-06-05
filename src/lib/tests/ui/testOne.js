import { chromium } from 'playwright';

const testOne = async ({ headless }) => {
    const browser = await chromium.launch({
        headless,
        slowMo: headless ? 0 : 500,
    });
    const page = await browser.newPage();
    const results = [];
    try {
        await page.goto('https://adentran.vercel.app/');
        await page.waitForTimeout(3000); // Wait for 3 seconds after page load
        const text = await page.textContent('//*[@id="root"]/main/div[3]/div[1]/div[1]/div/h1');
        results.push({
            test: "Test 1: Intro",
            expected: "Hi, I'm Aden.",
            actual: text,
            pass: text === "Hi, I'm Aden.",
            type: "UI",
        });
    } catch (error) {
        results.push({
            test: "Test 1: Intro",
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