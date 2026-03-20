import { initializeImageMagick, ImageMagick, MagickFormat } from "@imagemagick/magick-wasm";
import magickWasm from "@imagemagick/magick-wasm/magick.wasm?binary";

interface Options {
  extension: MagickFormat;
}

interface ConvertedImage {
  blob: Blob;
  alt: string;
}

export async function convertImage(file: File, options: Options): Promise<ConvertedImage> {
  await initializeImageMagick(magickWasm);

  const byteArray = new Uint8Array(await file.arrayBuffer());

  return new Promise((resolve) => {
    ImageMagick.read(byteArray, (img) => {
      img.format = options.extension;

      const alt = img.comment ?? "";

      img.write((output) => {
        resolve({
          blob: new Blob([output as Uint8Array<ArrayBuffer>]),
          alt,
        });
      });
    });
  });
}
