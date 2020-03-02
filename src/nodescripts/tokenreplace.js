const fs = require('fs')
const fse = require('fs-extra') //https://www.npmjs.com/package/fs-extra
const csv = require('csv-parser') //https://www.npmjs.com/package/csv-parser
const replace = require('replace-in-file'); //https://www.npmjs.com/package/replace-in-file
const fulldomainurl = 'https://www.alpha.ca.gov/'

//start by copying the existing language output to a source folder
const sourcefolder = 'public/'
const source = sourcefolder + 'langsrc'
fs.renameSync(sourcefolder+'en',source)

const globalfilepath = 'src/lang-global.csv'

//Update this list if you add languages
const targetlangs = [
  {code:'en',name:'English'},
  {code:'es',name:'Español'},
  {code:'zh',name:'中文(简体)'}
]

var remainingfolders = targetlangs.length //for checking if it is safe to delete

const csvresults = []
let sortedcsvresults = []
let fileslist = []

//Process the CSV file
fs.createReadStream(globalfilepath)
  .pipe(csv({ separator: ',', strict: true, skipComments: true, newline: '\r\n', mapHeaders: ({ header }) => header.toLowerCase().trim() } ))
  .on('data', data => {
    if(data['']) throw console.error('*** Remove empty columns from CSV file - ' + globalfilepath);

    data.path = data.path.replace(/\n/g, ' ').replace(/\/$/,'').trim()
    data.token=(data.token || data.en).trim()
    data['numMatches']=0
    csvresults.push(data)
  })
  .on('end',langloop)


function langloop() {
  if(!csvresults || csvresults.length==0) throw console.error(globalfilepath+' is empty!')

  //validate for unique combinations of paths/tokens
  const diff = csvresults.length-[...new Set(csvresults.map(item => item.path+item.token))].length
  if(diff>0) {
    //Find first dupe and report
    const dupe = csvresults.find((value,index) => 
      csvresults.find((value2,index2) => 
        index!=index2 && (value.path+value.token)==(value2.path+value2.token))
    )

    throw console.error(globalfilepath+` has ${diff} non-distinct path/token/en combo(s)! =>\n\n ${JSON.stringify(dupe)}`)
  }


  //Sort the CSV so that longer tokens are done first
  sortedcsvresults = csvresults.sort((a,b) => 100*(b.path.length-a.path.length)+b.token.length-a.token.length)

  //Distinct list of files
  fileslist = [...new Set(sortedcsvresults.map(item => item.path))].filter(x=>x)

  targetlangs.map(x=>x.code).forEach(targetlang=>
    // copy source folder to destination
    fse.copy(source, getdestination(targetlang), {overwrite: false, errorOnExist: true}, 
      err => err 
        ? console.error(err)
        : replaceonelanguage(targetlang))
  )
} //langloop



function replaceonelanguage(targetlang) {
  fileslist.forEach(path=> {
    let files = getdestination(targetlang)+path
    if(!files.includes('.')) files +='/**/*.html'

    //using global tokens and path matching tokens
    sortedcsvresults
      .filter(x=>!x.path||x.path===path)
      .forEach(data=>replaceonetoken(data,targetlang,files))

    //Replace custom HTML values based on language
    replace.sync({
        files,
        from:[
          /html lang="en"/g,
          /xml:lang="en"/g,
          /\[code-lang\]/g,
          /\[code-url\]/g,
          /\/en\//g,
          /\[code-language-select\]/g,
          /\[code-language-alt-meta\]/g,
          /\[FullPath\]/g
        ],
        to:[
          'html lang="'+targetlang+'"',
          'xml:lang="'+targetlang+'"',
          targetlang,
          removeenfrompath(fulldomainurl+targetlang)+'[FullPath]/',
          targetlang==removeenfrompath('/'+targetlang+'/'),
          targetlangs.map(l=>l.code!=targetlang ? `<a class="dropdown-item" rel="alternate" lang="${l.code}" hreflang="${l.code}" href="${removeenfrompath("/"+l.code)}[FullPath]/">${l.name}</a>` : '').join(''),
          targetlangs.map(l=>l.code!=targetlang ? `<link rel="alternate" hreflang="${l.code}" href="${removeenfrompath(fulldomainurl+l.code)}[FullPath]/">` : '').join(''),
          (match, ...args) => fileFromArgs(args,targetlang)
        ]})
  })

  if(targetlang=='en') 
    //English default goes to root
    fse.copy(getdestination(targetlang), sourcefolder, {overwrite: true, errorOnExist: false}, err => {
      if (err) return console.error(err)
      console.log(targetlang + ': Default Root Complete')
    })

  console.log(targetlang + ': Language Replacement Complete')

  if(!--remainingfolders) { //When the last folder is copied, delete the source and report on nomatches
    fse.remove(source)
    console.log('Removed temp lang folder')

    sortedcsvresults.filter(x=>x.numMatches==0).forEach(x=>
      console.warn(`WARNING - no language match for "${x.path} -> ${x.token}"`))
  }
} //replaceonelanguage

function replaceonetoken(data,targetlang,files) {
  const from = [new RegExp(data.token
    .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')// escape regex characters

    ,'g')] //add token with literal square brackets

  const to = data[targetlang]
    .replace(/<\/\s*/g,'<\/') //fixes broken html from auto-translate "</ i>" => "</i>"

  //replace this token, add the number of matches to the list
  replace.sync({files,from,to,countMatches: true})
    .forEach(x=>data.numMatches += x.numMatches||0)
}

function fileFromArgs(args,targetlang) { 
  return args.pop()
    .replace(/\/index.html$/,'') //Remove index.html
    .replace(new RegExp('^'+getdestination(targetlang).replace(/\//,'\/')),'') //Remove "public/en"
}

function getdestination(targetlang) {
  return sourcefolder+targetlang
}

function removeenfrompath(path) {
  return path.replace(/\/en/,'')
}