const fs = require('fs-extra');
const filesDir = __dirname + '\\files';
const copyDir = __dirname + '\\..\\..\\';

fs.copy(filesDir, copyDir, () => console.log(`Wow! All files copied in dir ${copyDir}`));

