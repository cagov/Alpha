const fs = require('fs')
const fse = require('fs-extra') //https://www.npmjs.com/package/fs-extra
const csv = require('csv-parser') //https://www.npmjs.com/package/csv-parser
const replace = require('replace-in-file'); //https://www.npmjs.com/package/replace-in-file
const sourcefolder = 'public/'

const globalfilepath = 'src/lang-global.csv'
const targetlangs = ['es','en']

//start by copying the existing language output to a source folder
const source = sourcefolder + 'langsrc'
fs.renameSync(sourcefolder+'en',source)

for(const targetlang of targetlangs) {

  const destination = sourcefolder+targetlang
  
  const files = destination+'/**/*.html'
  
  const from = [
    /lang="en"/g, 
    /\/en\//g
  ]
  
  const to = [
    'lang="'+targetlang+'"', 
    /es/
  ]
  
  const results = [];
  fs.createReadStream(globalfilepath)
    .pipe(csv())
    .on('data', (data) => {
      from.push(new RegExp(data.token.replace(/\[/,'\\\[').replace(/\]/,'\\\]'),'g')) //add token with literal square brackets

      if(data.path)
        to.push( (match, ...args) => {
            let file=args.pop()
              .replace(/\/index.html$/,'') //Remove index.html
              .replace(new RegExp('^'+destination.replace(/\//,'\/')),'') //Remove "public/en"

            if(!file)
              file ='/'

            //return text, or the original match if the file isn't right
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