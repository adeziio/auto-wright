const { chromium } = require('playwright');

async function runTests({ headless } = {}) {
  const browser = await chromium.launch({
    headless, // Use the parameter to toggle headless mode
    slowMo: headless ? 0 : 500, // Add slow motion only when not headless
    channel: 'msedge', // Launch Microsoft Edge
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
    return results;
  }
}

// 🔹 Test 2
async function testTwo(browser) {
  const page = await browser.newPage();
  const results = [];

  try {
    await page.goto('https://adentran.vercel.app/');

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
    return results;
  }
}

module.exports = runTests;
