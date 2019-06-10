/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const SVGIcons2SVGFontStream = require("svgicons2svgfont");
const svg2ttf = require("svg2ttf");
const ttf2woff = require("ttf2woff");
const wawoff2 = require("wawoff2");

const { writeFile } = require("./utils");

const generateSVGFont = (iconsData, fontName, dest, options) => {
  const fontStream = new SVGIcons2SVGFontStream({
    fontName,
    fontHeight: options.fontHeight,
    normalize: options.normalize || true,
    log() {} // Silence hints from SVGIcons2SVGFontStream
  });

  return new Promise((resolve, reject) => {
    const filename = `${fontName}.svg`;
    const buffers = [];
    fontStream
      .on("data", data => {
        buffers.push(data);
      })
      .pipe(fs.createWriteStream(path.join(dest, filename)))
      .on("finish", () => {
        console.log(`${filename} written!`);
        resolve({
          buffer: Buffer.concat(buffers),
          fileCreated: path.join(dest, filename)
        });
      })
      .on("error", reject);

    iconsData.forEach(icon => {
      const glyph = fs.createReadStream(icon.file);
      glyph.metadata = {
        name: icon.name,
        unicode: [icon.unicode]
      };
      fontStream.write(glyph);
    });

    fontStream.end();
  });
};
async function generateTTFFont(svgFontBuffer, fontName, dest) {
  const filename = `${fontName}.ttf`;
  const buffer = Buffer.from(
    svg2ttf(svgFontBuffer.toString(), { familyName: fontName }).buffer
  );
  await writeFile(path.join(dest, filename), buffer);
  console.log(`${filename} written!`);
  return {
    buffer,
    fileCreated: path.join(dest, filename)
  };
}
async function generateWOFFFont(ttfFontBuffer, fontName, dest) {
  const filename = `${fontName}.woff`;
  const buffer = Buffer.from(ttf2woff(ttfFontBuffer).buffer);
  await writeFile(path.join(dest, filename), buffer);
  console.log(`${filename} written!`);
  return {
    buffer,
    fileCreated: path.join(dest, filename)
  };
}
async function generateWOFF2Font(ttfFontBuffer, fontName, dest) {
  const filename = `${fontName}.woff2`;
  const buffer = await wawoff2.compress(ttfFontBuffer);
  await writeFile(path.join(dest, filename), buffer);
  console.log(`${filename} written!`);
  return {
    buffer,
    fileCreated: path.join(dest, filename)
  };
}

module.exports = {
  generateSVGFont,
  generateTTFFont,
  generateWOFFFont,
  generateWOFF2Font
};
