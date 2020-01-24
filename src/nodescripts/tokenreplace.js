const fse = require('fs-extra')
const fs = require('fs')
const csv = require('csv-parser')

const replace = require('replace-in-file');
//docs here https://www.npmjs.com/package/replace-in-file

var targetlangs = ['es','en2']

for(const targetlang of targetlangs) {
  const source = 'public/en'
  //var targetlang = 'es'
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
  fs.createReadStream('src/lang-global.csv')
    .pipe(csv())
    .on('data', (data) => {
      from.push(data.token)
      to.push(data[targetlang])
      //results.push(data))
    })
    .on('end', () => {
  
  
  // copy source folder to destination
  fse.copy(source, destination, {overwrite: false, errorOnExist: true}, function (err) {
      if (err)
          return console.error(err)
  
  
  
      // Replace HTML Language
      replace({files,from,to}, (error, results) => {
          if (error)
            return console.error(error);
        
          console.log('Lang Replacement results:', results);
      })
  
    })
  
  });
  
}



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
