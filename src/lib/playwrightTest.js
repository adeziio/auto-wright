const { chromium } = require('playwright');

async function runTests() {
  const browser = await chromium.launch({ 
    headless: true, 
    slowMo: 500 
});

  const tests = [
    testHomeTitle(browser),
    testSearchAdeziio(browser),
    testSearchSleepingtree(browser),
  ];

  const results = await Promise.all(tests);

  await browser.close();
  return results.flat(); // Flatten results from each test
}

// 🔹 Test 1: Check homepage title
async function testHomeTitle(browser) {
  const page = await browser.newPage();
  const results = [];

  try {
    await page.goto('https://gh-users-search.netlify.app/');
    const text = await page.textContent('h3');
    results.push({
      test: 'Homepage header should be "Welcome"',
      expected: 'Welcome',
      actual: text.trim(),
      pass: text.trim() === 'Welcome',
    });
  } catch (error) {
    results.push({
      test: 'Homepage title test error',
      expected: 'No Error',
      actual: error.message,
      pass: false,
    });
  } finally {
    await page.close();
    return results;
  }
}

// 🔹 Test 2: Search for "adeziio" and verify name
async function testSearchAdeziio(browser) {
    const page = await browser.newPage();
    const results = [];
  
    try {
      await page.goto('https://gh-users-search.netlify.app/');
      await page.fill('input[placeholder="enter github user name"]', 'adeziio');
      await page.keyboard.press('Enter');
  
      await page.waitForSelector('//*[@id="root"]/main/section[3]/div/article[1]'); // Wait for result
  
      const location = await page.textContent('//*[@id="root"]/main/section[3]/div/article[1]/header/div/h4');
      const value = location;
      results.push({
        test: 'Search "adeziio" → Name is "Aden Tran"',
        expected: 'Aden Tran',
        actual: value,
        pass: value === 'Aden Tran',
      });
    } catch (error) {
      results.push({
        test: '"adeziio" test error',
        expected: 'No Error',
        actual: error.message,
        pass: false,
      });
    } finally {
      await page.close();
      return results;
    }
}

// 🔹 Test 3: Search for "Sleepingtree" and verify location
async function testSearchSleepingtree(browser) {
  const page = await browser.newPage();
  const results = [];

  try {
    await page.goto('https://gh-users-search.netlify.app/');
    await page.fill('input[placeholder="enter github user name"]', 'Sleepingtree');
    await page.keyboard.press('Enter');

    await page.waitForSelector('//*[@id="root"]/main/section[3]/div/article[1]'); // Wait for result

    const location = await page.textContent('//*[@id="root"]/main/section[3]/div/article[1]/div/p[2]');
    const value = location;
    results.push({
      test: 'Search "Sleepingtree" → Location is "woodbridge"',
      expected: 'woodbridge',
      actual: value,
      pass: value === 'woodbridge',
    });
  } catch (error) {
    results.push({
      test: '"Sleepingtree" test error',
      expected: 'No Error',
      actual: error.message,
      pass: false,
    });
  } finally {
    await page.close();
    return results;
  }
}

module.exports = runTests;
