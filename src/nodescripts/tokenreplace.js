// You can convert language text here...https://www.charset.org/html-special-characters

const fs = require('fs')
const fse = require('fs-extra') //https://www.npmjs.com/package/fs-extra
const csv = require('csv-parser') //https://www.npmjs.com/package/csv-parser
const replace = require('replace-in-file'); //https://www.npmjs.com/package/replace-in-file

//start by copying the existing language output to a source folder
const sourcefolder = 'public/'
const source = sourcefolder + 'langsrc'
fs.renameSync(sourcefolder+'en',source)

const globalfilepath = 'src/lang-global.csv'

const targetlangs = [
  {code:'en',name:'English'},
  {code:'es',name:'Español'},
  {code:'zh',name:'Chinese'}
]

let csvresults = []
fs.createReadStream(globalfilepath, {encoding: 'utf16le'})
  .pipe(csv({ separator: '\t', strict: true, skipComments: true, newline: '\r\n', mapHeaders: ({ header }) => header.toLowerCase().trim() } ))
  .on('data', data => {
    if(data['']) throw console.error('*** Remove empty columns from CSV file - ' + globalfilepath);

    data.path = data.path.replace(/\n/g, ' ').trim()
    data.token=data.token || data.en
    csvresults.push(data)
  })
  .on('end', _ => {
    const sortedcsvresults = csvresults.sort((a,b) => 100*(b.path.length-a.path.length)+b.token.length-a.token.length)

    for(const targetlangobject of targetlangs) {
      const targetlang = targetlangobject.code

      console.log(targetlang + ': Language Replacement Start')

      let langselectorbutton = ''

      //Create the language selector
      for (const l of targetlangs)
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
      
        replace.sync({files,from:defaultfrom,to:defaultto})

        for(const data of sortedcsvresults) {
          //const sourcematch = data.token || data.en
          const from = [new RegExp(data.token
            .replace(/\[/,'\\\[')
            .replace(/\]/,'\\\]')
            .replace(/\)/,'\\\)')
            .replace(/\(/,'\\\(')
            ,'g')] //add token with literal square brackets

          //const replacement = data[targetlang]
          //  .replace(/<\/\s*(.*)>/g,'<\/$1>') //fixes broken html from auto-translate "</ i>" => "</i>"

          const to = data.path
          ? (match, ...args) =>
                //return text, or the original match if the file isn't right
                data.path==(fileFromArgs(args) || '/')
                ? replacement
                : match
          : replacement

          const results = replace.sync({files,from,to,countMatches: true})

          let found = false
            results.forEach(element => {
              if (element.numMatches != 0 )
                found = true
            })

          if(!found)
              return console.error(targetlang+': Error - Replacement not found - '+data.path+' - "'+data.token+'"')
        }

        if(targetlang=='en') 
          //English default goes to root
          fse.copy(destination, sourcefolder, {overwrite: true, errorOnExist: false}, err => {
            if (err) return console.error(err)
            console.log(targetlang + ': Default Root Complete')
          })

        console.log(targetlang + ': Language Replacement Complete')
      }) //fse.copy
    } //for(const targetlangobject of targetlangs)
  }) //createReadStream->end