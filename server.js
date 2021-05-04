const express = require('express');
const puppeteer = require('puppeteer');
const download = require('./downloader');
const server = express();

server.get('/', async (request, response) => {
  const browser = await puppeteer.launch({ headless: false }); //Sets headless to false, so puppeteer can open a chromium window. Serves only for debugging and studying purposes.
  const page = await browser.newPage();
  await page.goto(
    'http://www.ans.gov.br/prestadores/tiss-troca-de-informacao-de-saude-suplementar',
  );

  //We can use evaluate() from puppeteer to return a specified content from an HTML page. IN this case, we can use DOM to extract the link
  const pageContent = await page.evaluate(() => {
    return {
      link: document.querySelector('a.alert-link').getAttribute('href'),
    };
  });

  //Once the link is retrieved,
  await page.goto(`http://www.ans.gov.br${pageContent.link}`);

  const downloadLink = await page.evaluate(() => {
    return {
      link: document.querySelector('tr > td > a').getAttribute('href'),
    };
  });

  const url = `http://www.ans.gov.br${downloadLink.link}`;
  download(url, (filename) => {
    console.log('File ' + filename + ' succesfully downloaded.');
  });

  await browser.close();

  response.send('Done!');
});

const port = 3000;

server.listen(3000, () => {
  console.log(`Server listening on PORT${port}`);
});

// ==================
