const path = require('path');
const { readdir, readFile, writeFile, appendFile } = require('node:fs/promises')

async function createFile() {
  try {
    await writeFile(
      path.join(__dirname, 'project-dist', 'bundle.css'),
      ''
    );
    } catch {
      console.log('The file ./project-dist/bundle.css could not be created');
  }
}
createFile()

async function mergeFiles(src) {

  try {
    const files = await readdir(
      src,
      {withFileTypes: true},
    )
    let mergeСontent = '';

    for (let file of files) {

      let extension = path.extname(file.name);

      if (extension === '.css') {

        if (file.isDirectory()) {
          mergeFiles(path.join(src, file.name))
        }

        if (file.isFile()) {
          const contents = await readFile(
            path.join(src, file.name), 
            { encoding: 'utf8' }
          );
          mergeСontent += `${contents}\n`;
        }
      } else {
        continue
      }
    }
   
    await appendFile(
      path.join(__dirname, 'project-dist', 'bundle.css'), 
      mergeСontent
    );
    
  } catch (err) {
    console.error(err);
    console.log('The files could not be merged')
  } 

}
const srcStyles = path.join(__dirname, 'styles');
mergeFiles(srcStyles)