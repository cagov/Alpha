const fse = require('fs-extra')
const fs = require('fs')

const replace = require('replace-in-file');
//docs here https://www.npmjs.com/package/replace-in-file

var source = 'public/en'
var targetlang = 'es'
var destination = 'public/'+targetlang

var files = destination+'/**/*.html'

// copy source folder to destination
fse.copy(source, destination, {overwrite: false, errorOnExist: true}, function (err) {
    if (err)
        return console.error(err)

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


    // Replace HTML Language
    replace({files,from,to}, (error, results) => {
        if (error)
          return console.error(error);
      
        console.log('Lang Replacement results:', results);
    })
  })




//    const items = [] // files, directories, symlinks, etc
//klaw(source)
//.on('readable', function () {
//  let item
//  while ((item = this.read())) {
//    // do something with the file
//    console.log(item);


//fs.remove(destination); 

// copy source folder to destination
//fse.copy(source, destination, function (err) {
//    if (err){
//        console.log('An error occured while copying the folder.')
//        return console.error(err)
//    }
//    console.log('Copy completed!');


//    const items = [] // files, directories, symlinks, etc
//klaw(source)
//.on('readable', function () {
//  let item
//  while ((item = this.read())) {
//    // do something with the file
//    console.log(item);



//  }
//})
//.on('error', (err, item) => {
//  console.log(err.message)
//  console.log(item.path) // the file the error occurred on
//})
//.on('end', () => console.dir(items)) // => [ ... array of files]
//});
