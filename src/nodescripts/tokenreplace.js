const fs = require('fs')
const fse = require('fs-extra') //https://www.npmjs.com/package/fs-extra
const csv = require('csv-parser') //https://www.npmjs.com/package/csv-parser
const replace = require('replace-in-file'); //https://www.npmjs.com/package/replace-in-file

const globalfilepath = 'src/lang-global.csv'
var targetlangs = ['es','en']

//start by copying the existing language output to a source folder

const source = 'public/langsrc'
fs.renameSync('public/en',source)

for(const targetlang of targetlangs) {

  const destination = 'public/'+targetlang
  
  const files = destination+'/**/*.html'
  
  
  const from = [
    /lang="en"/g, 
    /\/en\//g,
    /Alp[A-Za-z-]+/g
  ]
  
  const to = [
    'lang="'+targetlang+'"', 
    /es/,
    (match, ...args) => 'Match='+ match +'file='+args.pop()
  ]
  
  
  const results = [];
  fs.createReadStream(globalfilepath)
    .pipe(csv())
    .on('data', (data) => {
      from.push(data.token)
      to.push(data[targetlang])
    })
    .on('end', () => {
  
  
  // copy source folder to destination
  fse.copy(source, destination, {overwrite: false, errorOnExist: true}, function (err) {
      if (err) return console.error(err)
  
      // Replace HTML Language
      replace({files,from,to}, (error, results) => {
          if (error) return console.error(error);
        
          console.log('Lang Replacement results:', results);
      })
  
    })
  
  });
  
}