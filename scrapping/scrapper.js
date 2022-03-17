const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://www.billboard.com/charts/hot-100/1982-03-12/");

    const top100 = await page.evaluate(() =>
        Array.from(
            document.getElementsByClassName(
                "o-chart-results-list-row-container"
            ),
            (e) => e.innerHTML
        )
    );

    top100.forEach((tweet) => {
        console.log(tweet);
    });
})();
