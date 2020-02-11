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

const targetlangs = [
  {code:'en',name:'English'},
  {code:'es',name:'Español'},
  {code:'zh',name:'中文(简体)'}
]

let csvresults = []
let sortedcsvresults = []
let fileslist = []
fs.createReadStream(globalfilepath)
  .pipe(csv({ separator: ',', strict: true, skipComments: true, newline: '\r\n', mapHeaders: ({ header }) => header.toLowerCase().trim() } ))
  .on('data', data => {
    if(data['']) throw console.error('*** Remove empty columns from CSV file - ' + globalfilepath);

    data.path = data.path.replace(/\n/g, ' ').trim()
    data.token=data.token || data.en
    data['numMatches']=0
    csvresults.push(data)
  })
  .on('end', langloop)



function langloop() {
  if(!csvresults || csvresults.length==0) throw console.error(globalfilepath+' is empty!')

  //validate for unique combinations of paths/tokens
  const diff = csvresults.length-[...new Set(csvresults.map(item => item.path+item.token))].length
  if(diff>0)
    console.error(globalfilepath+` has ${diff} non-distinct path/token/en combo(s)!`)

  sortedcsvresults = csvresults.sort((a,b) => 100*(b.path.length-a.path.length)+b.token.length-a.token.length)
  fileslist = [...new Set(sortedcsvresults.map(item => item.path))].filter(x=>x)

  console.log(fileslist)

  targetlangs.map(x=>x.code).forEach(targetlang=>
    // copy source folder to destination
    fse.copy(source, getdestination(targetlang), {overwrite: false, errorOnExist: true}, 
      err => err 
        ? console.error(err)
        : replaceonelanguage(targetlang))
  )
} //langloop  


function replaceonelanguage(targetlang) {
  //Global replace of HTML defaults
  replace.sync({
    files:getfilespath(targetlang),
    from:[
      /lang="en"/g,
      /\/en\//g,
      /\[code-language-select\]/g,
      /\[code-language-alt-meta\]/g,
      /\[FullPath\]/g
    ],
    to:[
      'lang="'+targetlang+'"', 
      targetlang=='en'?'/':'/'+targetlang+'/',
      targetlangs.map(l=>l.code!=targetlang ? '<a class="dropdown-item" rel="alternate" hreflang="'+l.code+'" href="/'+l.code+'[FullPath]/">'+l.name+'</a>' : '').join(''),
      targetlangs.map(l=>l.code!=targetlang ? '<link rel="alternate" hreflang="'+l.code+'" href="'+fulldomainurl+l.code+'[FullPath]/">' : '').join(''),
      (match, ...args) => fileFromArgs(args,targetlang)
    ]})

  fileslist.forEach(path=> {
    let files = getdestination(targetlang)+path
    if(!files.endsWith('.html')) files +='/index.html'

    sortedcsvresults
      .filter(x=>!x.path||x.path===path)
      .forEach(data=>replaceonetoken(data,targetlang,files))
  })

  const nomatch = sortedcsvresults.find(x=>x.numMatches==0)
  if(nomatch)
    return console.error(`no match for "${nomatch.path} -> ${nomatch.token}"`)

  if(targetlang=='en') 
    //English default goes to root
    fse.copy(getdestination(targetlang), sourcefolder, {overwrite: true, errorOnExist: false}, err => {
      if (err) return console.error(err)
      console.log(targetlang + ': Default Root Complete')
    })

  console.log(targetlang + ': Language Replacement Complete')
} //replaceonelanguage


function replaceonetoken(data,targetlang,files) {
  const from = [new RegExp(data.token
    .replace(/\[/,'\\\[')
    .replace(/\]/,'\\\]')
    .replace(/\)/,'\\\)')
    .replace(/\(/,'\\\(')
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

function getfilespath(targetlang) {
  return getdestination(targetlang)+'/**/*.html'
}