const fs = require('fs');
const http = require('http');
const https = require('https');
const URL = require('url').URL;

function download(url, callback) {
  const userURL = new URL(url);
  //Verifies the URL protocol and uses the one that matches it.
  const protocol = userURL.protocol === 'http:' ? http : https;
  const dir = `${__dirname}/Files`;
  const filename = url.split('/').pop(); //Extracts the filename from the URL
  const req = protocol.get(url, (response) => {
    //Checks if the "Files" folder exists. If not, create it.
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    const fileStream = fs.createWriteStream(`${dir}/${filename}`);
    response.pipe(fileStream);

    fileStream.on('error', (err) => {
      console.log('Error while writing to the stream.');
      console.log(err);
    });

    fileStream.on('close', () => {
      callback(filename);
    });

    fileStream.on('finish', () => {
      fileStream.close();
      console.log('Done.');
    });
  });

  req.on('error', (err) => {
    console.log('Error downloading the file.');
    console.log(err);
  });
}

module.exports = download;
