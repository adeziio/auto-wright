const { chromium } = require('playwright');

async function runTests() {
  const browser = await chromium.launch({
    headless: true,
    slowMo: 500
  });

  const tests = [
    testOne(browser),
    testTwo(browser),
  ];

  const results = await Promise.all(tests);

  await browser.close();
  return results.flat(); // Flatten results from each test
}

// 🔹 Test 1
async function testOne(browser) {
  const page = await browser.newPage();
  const results = [];

  try {
    await page.goto('https://adentran.vercel.app/');
    await page.waitForTimeout(3000); // Wait for 3 seconds
    const text = await page.textContent('//*[@id="root"]/main/div[3]/div[1]/div[1]/div/h1');
    results.push({
      test: "Test 1: Intro",
      expected: "Hi, I'm Aden.",
      actual: text,
      pass: text === "Hi, I'm Aden.",
      type: "UI", // Added field to distinguish test type
    });
  } catch (error) {
    results.push({
      test: "Test 1: Intro",
      expected: "No Error",
      actual: error.message,
      pass: false,
      type: "UI", // Added field to distinguish test type
    });
  } finally {
    await page.close();
    return results;
  }
}

// 🔹 Test 2
async function testTwo(browser) {
  const page = await browser.newPage();
  const results = [];

  try {
    await page.goto('https://adentran.vercel.app/');
    await page.waitForTimeout(3000); // Wait for 3 seconds

    // Verify the content of the "About Me" section
    const aboutMeContent = await page.textContent('//*[@id="about"]/div/div[2]/div[2]');
    const majorCheck = aboutMeContent.includes('Computer Science');
    const countryCheck = aboutMeContent.includes('Vietnam');
    const schoolCheck = aboutMeContent.includes('George Mason University');

    results.push({
      test: "Test 2: About Me Section",
      expected: "Contains 'Computer Science'",
      actual: majorCheck ? "Contains 'Computer Science'" : "Does not contain 'Computer Science'",
      pass: majorCheck,
      type: "UI", // Added field to distinguish test type
    });

    results.push({
      test: "Test 2: About Me Section",
      expected: "Contains 'Vietnam'",
      actual: countryCheck ? "Contains 'Vietnam'" : "Does not contain 'Vietnam'",
      pass: countryCheck,
      type: "UI", // Added field to distinguish test type
    });

    results.push({
      test: "Test 2: About Me Section",
      expected: "Contains 'George Mason University'",
      actual: schoolCheck ? "Contains 'George Mason University'" : "Does not contain 'George Mason University'",
      pass: schoolCheck,
      type: "UI", // Added field to distinguish test type
    });

    results.push({
      test: "Test 2: About Me Section",
      expected: "I am expected to fail and display an error",
      actual: "error",
      pass: false,
      type: "UI", // Added field to distinguish test type
    });
  } catch (error) {
    results.push({
      test: "Test 2: About Me Section",
      expected: "No Error",
      actual: error.message,
      pass: false,
      type: "UI", // Added field to distinguish test type
    });
  } finally {
    await page.close();
    return results;
  }
}

module.exports = runTests;
