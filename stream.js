const fs = require('fs')

const readStream = fs.createReadStream('./text.txt',{encoding : 'utf8'});
const writeStream = fs.createWriteStream('./text2.txt')
//data event
// readStream.on('data', (chunk) => {
//     console.log("-------------------------------------------------------------------")
//     console.log(chunk);
//     writeStream.write('\nNew Chunk\n')
//     writeStream.write(chunk)
// })

readStream.pipe(writeStream)