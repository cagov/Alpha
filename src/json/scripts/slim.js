const fs = require('fs');

const zips = JSON.parse(fs.readFileSync('../unique-zips.json', 'utf8'));

// console.log(zips.length)

const slim = [];

zips.forEach((item) => {
  for (let key in item) {
    slim.push(key);
    fs.writeFileSync('../zips/' + key + '.json', JSON.stringify(item[key]), 'utf8');
  }
});

fs.writeFileSync('../unique-zips-slim.json', JSON.stringify(slim), 'utf8');
