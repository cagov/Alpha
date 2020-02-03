// You can convert language text here...https://www.charset.org/html-special-characters

const fs = require('fs')
const fse = require('fs-extra') //https://www.npmjs.com/package/fs-extra
const csv = require('csv-parser') //https://www.npmjs.com/package/csv-parser
const replace = require('replace-in-file'); //https://www.npmjs.com/package/replace-in-file
const sourcefolder = 'public/'

const globalfilepath = 'src/lang-global.csv'
const targetlangs = [
  {code:'en',name:'English'},
  {code:'es',name:'Español'},
  {code:'zh',name:'Chinese'}
]

//start by copying the existing language output to a source folder
const source = sourcefolder + 'langsrc'
fs.renameSync(sourcefolder+'en',source)

for(const targetlangobject of targetlangs) {
  const targetlang = targetlangobject.code

  let langselectorbutton = ''

  //Create the language selector
  for(const l of targetlangs)
    if(l.code!=targetlang)
      langselectorbutton+='<a class="dropdown-item" href="/'+l.code+'[FullPath]">'+l.name+'</a>'

  const destination = sourcefolder+targetlang

  // copy source folder to destination
  fse.copy(source, destination, {overwrite: false, errorOnExist: true}, err => {
    if (err) return console.error(err)

    const fileFromArgs = args => args.pop()
      .replace(/\/index.html$/,'') //Remove index.html
      .replace(new RegExp('^'+destination.replace(/\//,'\/')),'') //Remove "public/en"
    
    const files = destination+'/**/*.html'
    
    const defaultfrom = [
      /lang="en"/g,
      /\/en\//g,
      /\[code-language-select\]/g,
      /\[FullPath\]/g
    ]
    
    const defaultto = [
      'lang="'+targetlang+'"', 
      targetlang=='en'?'/':'/'+targetlang+'/',
      langselectorbutton,
      (match, ...args) => fileFromArgs(args)
    ]
  
    replace({files,from:defaultfrom,to:defaultto}, (error, results) => {
      if (error) return console.error(error);

      fs.createReadStream(globalfilepath, {encoding: 'utf16le'})
        .pipe(csv({ separator: '\t', strict: true, skipComments: true, newline: '\r\n' }))
        .on('data', data => {

          if(data.token&&data[targetlang]) {
            const from = [new RegExp(data.token.replace(/\[/,'\\\[').replace(/\]/,'\\\]'),'g')] //add token with literal square brackets
            let to = []
            if(data.path)
              to = (match, ...args) => {
                  let file=fileFromArgs(args)

                  if(!file)
                    file ='/'

                  //return text, or the original match if the file isn't right
                  return data.path==file ? data[targetlang] : match
                
              }
            else
              to = data[targetlang]
            
              
            replace({files,from,to}, (error, results) => {
                if (error) return console.error(error);

                let found = false
                results.forEach(element => {
                  if (element.hasChanged)
                    found = true
                });

                if(!found)
                  return console.error('replacement not found - '+data.token);

                //console.log(results);
            })
        }})
        .on('end', _ => {
          //English default goes to root
        if(targetlang=='en') 
          fse.copy(destination, sourcefolder, {overwrite: true, errorOnExist: false}, err => {
            if (err) return console.error(err)
          })

        //console.log('Lang Replacement results:', results);
        console.log(targetlang + ': Language Replacement Complete:');
      })
    })  
  })
}