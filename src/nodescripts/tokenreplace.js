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
let sortedcsvresults = []
fs.createReadStream(globalfilepath)
  .pipe(csv())
  .on('data', data => {
    if(data['']) throw console.error('*** Remove empty columns from CSV file - ' + globalfilepath);

    data.path = data.path.replace(/\n/g, ' ').trim()
    data.token=data.token || data.en
    csvresults.push(data)
  })
  .on('end', langloop)



function langloop() {
  if(!csvresults || csvresults.length==0) throw console.error(globalfilepath+' is empty!')

  sortedcsvresults = csvresults.sort((a,b) => 100*(b.path.length-a.path.length)+b.token.length-a.token.length)

  for(const targetlang of targetlangs.map(x=>x.code)) 
    // copy source folder to destination
    fse.copy(source, getdestination(targetlang), {overwrite: false, errorOnExist: true}, 
      err => err 
        ? console.error(err)
        : replaceonelanguage(targetlang))
  
} //langloop  


function replaceonelanguage(targetlang) {
  //Global replace of defaults
  replace.sync({
    files:getfilespath(targetlang),
    from:[
      /lang="en"/g,
      /\/en\//g,
      /\[code-language-select\]/g,
      /\[FullPath\]/g
    ],
    to:[
      'lang="'+targetlang+'"', 
      targetlang=='en'?'/':'/'+targetlang+'/',
      targetlangs.map(l=>l.code!=targetlang ? '<a class="dropdown-item" rel="alternate" hreflang="'+l.code+'" href="/'+l.code+'[FullPath]/">'+l.name+'</a>' : '').join(''),
      (match, ...args) => fileFromArgs(args,targetlang)
    ]})

  //run each token in order
  sortedcsvresults.forEach(data=>replaceonetoken(data,targetlang))

  if(targetlang=='en') 
    //English default goes to root
    fse.copy(getdestination(targetlang), sourcefolder, {overwrite: true, errorOnExist: false}, err => {
      if (err) return console.error(err)
      console.log(targetlang + ': Default Root Complete')
    })

  console.log(targetlang + ': Language Replacement Complete')
} //replaceonelanguage


function replaceonetoken(data,targetlang) {
  const from = [new RegExp(data.token
    .replace(/\[/,'\\\[')
    .replace(/\]/,'\\\]')
    .replace(/\)/,'\\\)')
    .replace(/\(/,'\\\(')
    ,'g')] //add token with literal square brackets

  replacement = data[targetlang]
    .replace(/<\/\s*/g,'<\/') //fixes broken html from auto-translate "</ i>" => "</i>"

  const to = data.path
  ? (match, ...args) =>
        //return text, or the original match if the file isn't right
        data.path==(fileFromArgs(args,targetlang) || '/')
        ? replacement
        : match
  : replacement

  //replace this token, return an error if it isn't found
  if (!replace.sync(
      {files:getfilespath(targetlang),from,to,countMatches: true})
        .find(value=>value.numMatches != 0))
    return console.error(targetlang+': Error - Replacement not found - '+data.path+' - "'+data.token+'"')
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