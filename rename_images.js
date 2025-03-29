const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, 'images/grid');

fs.readdir(directory, (err, files) => {
  if (err) {
    return console.error('Unable to scan directory: ' + err);
  }

  files.sort().forEach((file, index) => {
    const oldPath = path.join(directory, file);
    const newPath = path.join(directory, `image${index + 1}.jpg`);

    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        return console.error('Error renaming file: ' + err);
      }
      console.log(`Renamed ${file} to image${index + 1}.jpg`);
    });
  });
});
