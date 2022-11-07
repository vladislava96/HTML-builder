const path = require('path');
const { mkdir, copyFile, readdir, readFile, writeFile, appendFile } = require('node:fs/promises');


async function createDir() {
  try {
    await mkdir(
      path.join(__dirname, 'project-dist'), 
      { recursive: true }
    );
    
  } catch (err) {
    console.error(err.message);
    console.log('The directory ./project-dist, ./assets could not be created');
  }
}
createDir()

async function copyDir(src, dist) {
 
  try {
    await mkdir(
      dist,
      { recursive: true }
    );

    const files = await readdir(
      src,
      {withFileTypes: true},
    )

    for (let file of files) {

      if (file.isDirectory()) {

        copyDir(
          path.join(src, file.name), 
          path.join(dist, file.name)
        )

      }

      if (file.isFile()) {

        await copyFile(
          path.join(src, file.name),
          path.join(dist, file.name)
        );

      }
    }

  } catch (err) {
    console.error(err);
    console.log('The directory assets could not be copied');
  }

}
const src = path.join(__dirname, 'assets');
const dist = path.join(__dirname, 'project-dist', 'assets');
copyDir(src, dist);

async function copy() {
  try {
    await copyFile(
      path.join(__dirname, 'template.html'), 
      path.join (__dirname, 'project-dist', 'index.html')
    );
  } catch {
    console.log('The file ./project-dist/index.css could not be copied');
  }
}
copy()


async function createFile() {
  try {
    await writeFile(
      path.join(__dirname, 'project-dist', 'style.css'),
      ''
    );
    } catch {
      console.log('The file ./project-dist/style.css could not be created');
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

    }
   
    await appendFile(
      path.join(__dirname, 'project-dist', 'style.css'), 
      mergeСontent
    );
    
  } catch (err) {
    console.error(err);
    console.log('The files could not be merged')
  } 

}
const srcStyles = path.join(__dirname, 'styles');
mergeFiles(srcStyles)

async function readComponents(src) {

  try {
    const files = await readdir(
      src,
      { withFileTypes: true },
    )
    let componentNames = [];
    let components = {};

    for (let file of files) {

      if (file.isDirectory()) {
        readComponents(path.join(src, file.name))
      }

      if (file.isFile()) {
        let extension = path.extname(file.name);
        let name = path.basename(path.join(src, file.name), extension);
        componentNames.push(name)

        const contents = await readFile(
          path.join(src, file.name), 
          { encoding: 'utf8' }
        );
        components[name] = contents;
      }

    }

    let contents = await readFile(
      path.join(__dirname, 'project-dist', 'index.html'), 
      { encoding: 'utf8' }
    );
    
    for (let componentName of componentNames) {
      contents = contents.replace(`{{${componentName}}}`, components[componentName]);
    }
    writeFile(
      path.join(__dirname, 'project-dist', 'index.html'), 
      contents
    )

  } catch (err) {
    console.error(err);
  }

}
const srcComponents = path.join(__dirname, 'components');
readComponents(srcComponents)