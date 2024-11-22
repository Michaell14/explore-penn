const sharp = require('sharp');
const fs = require('fs');

export async function processAndUpload(filePath, destination) {
  const outputFilePath = '/tmp/compressed.jpg';

  await sharp(filePath)
    .resize({ width: 800 })
    .jpeg({ quality: 70 })
    .toFile(outputFilePath);

  await bucket.upload(outputFilePath, {
    destination,
    metadata: { contentType: 'image/jpeg' },
  });

  fs.unlinkSync(outputFilePath);
}
