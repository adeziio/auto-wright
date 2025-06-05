import { chromium } from 'playwright';

const testTwo = async (configs) => {
    const browser = await chromium.launch(configs);
    const page = await browser.newPage();
    const results = [];
    try {
        await page.goto('https://adentran.vercel.app/');
        const aboutMeContent = await page.textContent('//*[@id="about"]/div/div[2]/div[2]');
        const majorCheck = aboutMeContent.includes('Computer Science');
        const countryCheck = aboutMeContent.includes('Vietnam');
        const schoolCheck = aboutMeContent.includes('George Mason University');

        results.push({
            test: "Test 2: About Me Section",
            expected: "Contains 'Computer Science'",
            actual: majorCheck ? "Contains 'Computer Science'" : "Does not contain 'Computer Science'",
            pass: majorCheck,
            type: "UI",
        });

        results.push({
            test: "Test 2: About Me Section",
            expected: "Contains 'Vietnam'",
            actual: countryCheck ? "Contains 'Vietnam'" : "Does not contain 'Vietnam'",
            pass: countryCheck,
            type: "UI",
        });

        results.push({
            test: "Test 2: About Me Section",
            expected: "Contains 'George Mason University'",
            actual: schoolCheck ? "Contains 'George Mason University'" : "Does not contain 'George Mason University'",
            pass: schoolCheck,
            type: "UI",
        });

        results.push({
            test: "Test 2: About Me Section",
            expected: "I am expected to fail and display an error",
            actual: "error",
            pass: false,
            type: "UI",
        });
    } catch (error) {
        results.push({
            test: "Test 2: About Me Section",
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