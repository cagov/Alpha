const fs = require('fs');
const request = require('request');

const download = (url, dest, cb) => {
  const file = fs.createWriteStream(dest);
  const sendReq = request.get(url);

  // verify response code
  sendReq.on('response', (response) => {
    if (response.statusCode !== 200) {
      return cb('Response status was ' + response.statusCode);
    }

    sendReq.pipe(file);
  });

  // close() is async, call cb after close completes
  file.on('finish', () => file.close(cb));

  // check for request errors
  sendReq.on('error', (err) => {
    fs.unlink(dest);
    return cb(err.message);
  });

  file.on('error', (err) => { // Handle errors
    fs.unlink(dest); // Delete the file async. (But we don't check the result)
    return cb(err.message);
  });
};

download('https://docs.google.com/spreadsheets/d/e/2PACX-1vT8aUVX-O2vt3Z0y3k0pipxtILfx7E5VFk4yKGOm_nniHF8DNAeaZcM_yMma8rpOP0xjv9N8fi9lPGo/pub?output=csv&extra=' + (new Date().getTime().toString()), './src/lang-global.csv', function (msg) {
  console.log('done');
});
