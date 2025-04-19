const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

app.get('/screenshot', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).send("Missing url");

  try {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
    const buffer = await page.screenshot({ type: 'png' });
    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    res.send(buffer);
  } catch (err) {
    res.status(500).send("Screenshot error: " + err.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🟢 Screenshot server running on port ${port}`));
