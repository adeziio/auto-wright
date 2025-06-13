import { chromium } from 'playwright';

const keywords = [
    'Computer Science',
    'Vietnam',
    'George Mason University',
    'Sky High',
];

const testTwo = async (configs) => {
    const start = Date.now();
    const browser = await chromium.launch(configs);
    const page = await browser.newPage();
    const results = [];
    const filename = 'testTwo';
    const url = 'https://adentran.vercel.app/';

    try {
        await page.goto(url);
        await page.evaluate(() => window.scrollBy(0, 1850));
        await page.waitForTimeout(2000);

        const aboutMeContent = await page.textContent('//*[@id="about"]/div/div[2]/div[2]');

        let prev = start;
        for (const keyword of keywords) {
            const stepStart = prev;
            const pass = aboutMeContent.includes(keyword);
            let screenshotBase64;
            if (!pass) {
                const buffer = await page.screenshot();
                screenshotBase64 = buffer.toString('base64');
            }
            const stepEnd = Date.now();
            const duration = stepEnd - stepStart;
            prev = stepEnd;
            results.push({
                test: filename,
                url,
                description: `Validating that the paragraph contains '${keyword}'.`,
                expected: `Contains '${keyword}'`,
                actual: pass ? `Contains '${keyword}'` : `Does not contain '${keyword}'`,
                pass,
                type: "UI",
                duration,
                ...(screenshotBase64 && { screenshotBase64 }),
            });
        }
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

export default testTwo;