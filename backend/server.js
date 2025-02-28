const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
app.use(cors());

const PORT = 5000;

app.get('/api/job-links', async (req, res) => {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: true }); // Change to false to see the browser
        const page = await browser.newPage();
        
        const jobStreetURL = 'https://ph.jobstreet.com/jobs-in-information-communication-technology';
        await page.goto(jobStreetURL, { waitUntil: 'domcontentloaded' });

        // Wait for job listings to load
        await page.waitForSelector('a[data-automation="job-list-view-job-link"]');

        // Extract job links
        const jobLinks = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a[data-automation="job-list-view-job-link"]'))
                .map(a => a.href);
        });

        await browser.close();
        res.json({ jobLinks }); // ✅ Send extracted links as JSON response

    } catch (error) {
        console.error('Error scraping jobs:', error);
        if (browser) await browser.close();
        res.status(500).json({ error: 'Failed to scrape job links' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
