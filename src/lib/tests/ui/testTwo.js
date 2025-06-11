import { chromium } from 'playwright';

const testTwo = async (configs) => {
    const browser = await chromium.launch(configs);
    const page = await browser.newPage();
    const results = [];
    const filename = 'testTwo'; // No .js extension
    const url = 'https://adentran.vercel.app/';
    try {
        await page.goto(url);

        const aboutMeContent = await page.textContent('//*[@id="about"]/div/div[2]/div[2]');
        const majorCheck = aboutMeContent.includes('Computer Science');
        const countryCheck = aboutMeContent.includes('Vietnam');
        const schoolCheck = aboutMeContent.includes('George Mason University');

        results.push({
            test: filename,
            url,
            description: "Validating that the paragraph contains 'Computer Science'.",
            expected: "Contains 'Computer Science'",
            actual: majorCheck ? "Contains 'Computer Science'" : "Does not contain 'Computer Science'",
            pass: majorCheck,
            type: "UI",
        });

        results.push({
            test: filename,
            url,
            description: "Validating that the paragraph contains 'Vietnam'.",
            expected: "Contains 'Vietnam'",
            actual: countryCheck ? "Contains 'Vietnam'" : "Does not contain 'Vietnam'",
            pass: countryCheck,
            type: "UI",
        });

        results.push({
            test: filename,
            url,
            description: "Validating that the paragraph contains 'George Mason University'.",
            expected: "Contains 'George Mason University'",
            actual: schoolCheck ? "Contains 'George Mason University'" : "Does not contain 'George Mason University'",
            pass: schoolCheck,
            type: "UI",
        });

        results.push({
            test: filename,
            url,
            description: "This step is expected to fail for demonstration purposes.",
            expected: "I am expected to fail and display an error",
            actual: "error",
            pass: false,
            type: "UI",
        });
    } catch (error) {
        results.push({
            test: filename,
            url,
            description: "Catching any unexpected error during the UI test.",
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

export default testTwo;