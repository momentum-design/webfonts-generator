/* eslint-disable no-console */
const { extractName, getNextCodepoint, glob, mkdir } = require("../lib/utils");
const {
  generateSVGFont,
  generateTTFFont,
  generateWOFFFont,
  generateWOFF2Font
} = require("../lib/fontsGenerators");

async function generateFonts(fontName, pattern, dest = "dist", options = {}) {
  try {
    if (!fontName) throw new Error(`A font name wasn't specified`);

    let files = await glob(pattern);
    if (files.length === 0)
      throw new Error(`No icons were found using ${pattern}`);

    const glyphsData = files.map(file => {
      const name = extractName(file);
      const codepoint = getNextCodepoint();
      const codepointHexa = codepoint.toString(16);
      const unicode = String.fromCodePoint(codepoint);

      return {
        name,
        file,
        codepoint,
        codepointHexa,
        unicode
      };
    });

    await mkdir(dest);

    const {
      buffer: svgFontBuffer,
      fileCreated: svgFile
    } = await generateSVGFont(glyphsData, fontName, dest, options);

    const {
      buffer: ttfFontBuffer,
      fileCreated: ttfFile
    } = await generateTTFFont(svgFontBuffer, fontName, dest);

    const { fileCreated: wofffFile } = await generateWOFFFont(
      ttfFontBuffer,
      fontName,
      dest
    );

    const { fileCreated: wofff2File } = await generateWOFF2Font(
      ttfFontBuffer,
      fontName,
      dest
    );

    return {
      fontName,
      glyphsData,
      fontFiles: {
        svg: svgFile,
        ttf: ttfFile,
        woff: wofffFile,
        woff2: wofff2File
      }
    };
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  generateFonts
};
