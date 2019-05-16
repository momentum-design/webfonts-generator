# @momentum-ui/webfonts-generator

This webfonts generator takes SVG icons and transform them to WOFF and WOFF 2 fonts.

Developed specifically for the needs of [Cisco's Momentum design system](http://www.momentum-ui.com), this project is quite opinionated but open to features request and PRs nonetheless.

Despite being written from scratch, this project was inspired by the (now archived) project [webfonts-generator](https://github.com/sunflowerdeath/webfonts-generator) project.

## Caveats

- Technically generates SVG and TTF fonts too, because they are necessary steps to get WOFF fonts from SVG files with today's tools.
- Only runs on Node.JS 10 or better (because the source code relies heavily on `async`/`await`).
- Never tested on Windows (but should work).
- Does not generate EOT font (unecessary, woff and woff2 cover all modern browsers as well as IE9 and IE10).
- There is no CLI, only a Node.JS API (PR welcome).
- There is no way to pass down options to the tools used under the hood (`svgicons2svgfont`, `svg2ttf`, `ttf2woff` and `wawoff2`).

## Usage

```js
const { generateFonts } = require("@momentum-ui/webfonts-generator");

generateFonts("My Awesome Font", "icons/*.svg", "fonts").then(result => {
  console.log(`Webfont ${result.fontName} created!`);
  console.log(`WOFF file: ${result.fontFiles.woff}`);
  console.log(`WOFF2 file: ${result.fontFiles.woff2}`);
  console.log(`Glyphs information:`, result.glyphsData);
});
```

## Development

TBD
