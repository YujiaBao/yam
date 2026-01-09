const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const source = '/Users/yujiabao/Downloads/yam.png';
const dest = path.join(__dirname, '../build/icon.png');

async function processIcon() {
  try {
    console.log(`Processing ${source}...`);
    
    // macOS Big Sur+ icon shape (approximate squircle)
    // We create a mask of 512x512
    const size = 512;
    // Radius for macOS icons is roughly 22.37% of size
    const radius = Math.round(size * 0.2237);
    
    // Create a rounded rectangle mask
    const mask = Buffer.from(
      `<svg><rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" ry="${radius}" /></svg>`
    );

    await sharp(source)
      .resize(size, size, { fit: 'cover' })
      .composite([{
        input: mask,
        blend: 'dest-in'
      }])
      .png()
      .toFile(dest);

    console.log(`Icon saved to ${dest}`);
  } catch (err) {
    console.error('Error processing icon:', err);
    process.exit(1);
  }
}

processIcon();
