const path = require('path');
const { mkdir, readdir, copyFile} = require('node:fs/promises')

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
    console.log('The directory could not be copied');
  }

}
const src = path.join(__dirname, 'files');
const dist = path.join(__dirname, 'files-copy');
copyDir(src, dist);