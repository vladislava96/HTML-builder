const fs = require('fs');
const path = require('path');


fs.readdir(
  path.join(__dirname, 'secret-folder'),
  {withFileTypes: true},
  (err, data) => {

    if (err) throw err;
    let newData = [];
  
    for (let fileData of data) {
      if(fileData.isFile()) {
        newData.push(fileData)
      }
    }

    for (let fileData of newData) {

      let extension = path.extname(fileData.name);
      let name = path.basename(`./03-files-in-folder/secret-folder/${fileData.name}`, extension);
      
      fs.stat(
        `./03-files-in-folder/secret-folder/${fileData.name}`, 
        (err, stats) => {
          let size = stats.size;
          extension = extension.replace('.', '');
          console.log(`${name} - ${extension} - ${size} byte`)
        }
      )
    }
  }
)


