import { FFmpeg } from "@ffmpeg/ffmpeg";

export async function loadFFmpeg(): Promise<FFmpeg> {
  const ffmpeg = new FFmpeg();

  const coreURL = await import("@ffmpeg/core?binary").then(({ default: b }) => {
    return URL.createObjectURL(new Blob([b], { type: "text/javascript" }));
  });
  const wasmURL = await import("@ffmpeg/core/wasm?binary").then(({ default: b }) => {
    return URL.createObjectURL(new Blob([b], { type: "application/wasm" }));
  });

  await ffmpeg.load({ coreURL, wasmURL });

  URL.revokeObjectURL(coreURL);
  URL.revokeObjectURL(wasmURL);

  return ffmpeg;
}
