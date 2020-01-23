const fse = require('fs-extra')
const fs = require('fs')

const replace = require('replace-in-file');
//docs here https://www.npmjs.com/package/replace-in-file

var source = 'public/services'
var destination = 'public/NEWen'

// Remove dest
fse.remove(destination,
  function (err) {
    if (err) {
        console.log(destination + ': An error occured while removing the folder.')
        return console.error(err)
    }
  console.log(destination + 'Remove completed!');

  // copy source folder to destination
  fse.copy(source, destination, {errorOnExist: true}, function (err) {
      if (err){
          console.log(destination + ': An error occured while copying the folder.')
          return console.error(err)
      }
      console.log(destination + 'Copy completed!');

      // Replace Text
      const options = {
        files: destination+'/**/*.html',
        from: /Alp[A-Za-z-]+/g,
        to: (match, ...args) => 'Match='+ match +'file='+args.pop()
      };

      replace(options, (error, results) => {
        if (error)
          return console.error('Error occurred:', error);
        
        console.log('Replacement results:', results);
      });
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
