// You can convert language text here...https://www.charset.org/html-special-characters

const fs = require('fs')
const fse = require('fs-extra') //https://www.npmjs.com/package/fs-extra
const csv = require('csv-parser') //https://www.npmjs.com/package/csv-parser
const replace = require('replace-in-file'); //https://www.npmjs.com/package/replace-in-file
const sourcefolder = 'public/'

const globalfilepath = 'src/lang-global.csv'
const targetlangs = ['es','en','zh','uk']

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
     targetlang=='en'?'/':'/'+targetlang+'/'
  ]
  
  const results = [];
  fs.createReadStream(globalfilepath, {encoding: 'utf16le'})
    .pipe(csv({ separator: '\t', strict: true, skipComments: true, newline: '\r\n' }))
    .on('data', data => {

      if(data.token&&data[targetlang]) {
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
    }})
    .on('end', _ => 
    
  // copy source folder to destination
  fse.copy(source, destination, {overwrite: false, errorOnExist: true}, err => {
      if (err) return console.error(err)
  
      // Replace HTML Language
      replace({files,from,to}, (error, results) => {
        if (error) return console.error(error);

        //English default goes to root
        if(targetlang=='en') 
          fse.copy(destination, sourcefolder, {overwrite: true, errorOnExist: false}, err => {
            if (err) return console.error(err)
          })

        //console.log('Lang Replacement results:', results);
        console.log(targetlang + ': Language Replacement Complete:');
      })
    })
  );
}