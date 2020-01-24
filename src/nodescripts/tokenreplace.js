const fs = require('fs')
const fse = require('fs-extra') //https://www.npmjs.com/package/fs-extra
const csv = require('csv-parser') //https://www.npmjs.com/package/csv-parser
const replace = require('replace-in-file'); //https://www.npmjs.com/package/replace-in-file
const sourcefolder = 'public/'

const globalfilepath = 'src/lang-global.csv'
var targetlangs = ['es','en']

//start by copying the existing language output to a source folder

const source = sourcefolder + 'langsrc'
fs.renameSync(sourcefolder+'en',source)

for(const targetlang of targetlangs) {

  const destination = sourcefolder+targetlang
  
  const files = destination+'/**/*.html'
  
  
  const from = [
    /lang="en"/g, 
    /\/en\//g,
    ///Alp[A-Za-z-]+/g
  ]
  
  const to = [
    'lang="'+targetlang+'"', 
    /es/,
    //(match, ...args) => 'Match='+ match +'file='+args.pop()
  ]
  
  
  const results = [];
  fs.createReadStream(globalfilepath)
    .pipe(csv())
    .on('data', (data) => {
      var token = data.token.replace(/\[/,'\\\[').replace(/\]/,'\\\]')

      from.push(new RegExp(token,'g'))

      if(data.path)
        to.push(function (match, ...args) {
            const file=args.pop().replace(/index.html$/,'').replace(destination.replace(/\//,'\/'),'')

            //return file
            return data.path==file ? data[targetlang] : match
          
        })
      else
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