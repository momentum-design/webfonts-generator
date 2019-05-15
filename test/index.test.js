const path = require("path");

const { generateFonts } = require("../src/index");

describe("generateFonts", function() {
  it("should be a function", function() {
    expect(generateFonts).toBeInstanceOf(Function);
  });

  it("should emits an error if no icons found", async function() {
    const consoleError = jest
      .spyOn(global.console, "error")
      .mockImplementationOnce(() => {});
    await generateFonts("My Font", "*.svg", "test/dist");
    expect(consoleError).toHaveBeenCalled();
  });

  it("should return useful data", async function() {
    global.console = {
      log: jest.fn()
    };
    const result = await generateFonts(
      "My Font",
      "test/icons/*.svg",
      "test/dist"
    );
    expect(result.fontName).toEqual("My Font");
    expect(result.fontFiles.svg).toEqual(
      path.join("test", "dist", "My Font.svg")
    );
    expect(result.fontFiles.ttf).toEqual(
      path.join("test", "dist", "My Font.ttf")
    );
    expect(result.fontFiles.woff).toEqual(
      path.join("test", "dist", "My Font.woff")
    );
    expect(result.fontFiles.woff2).toEqual(
      path.join("test", "dist", "My Font.woff2")
    );
    expect(result.glyphsData.length).toEqual(5);
    expect(result.glyphsData[0]).toEqual({
      name: "accessibility_16",
      file: path.join("test", "icons", "accessibility_16.svg"),
      codepoint: 0xf101,
      codepointHexa: "f101",
      unicode: String.fromCodePoint(0xf101)
    });
  });
});
