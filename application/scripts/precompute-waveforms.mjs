// Pre-compute waveform data from seed MP3 files.
// Outputs JSON files with 100 peak values for each sound.
// Usage: node scripts/precompute-waveforms.mjs

import { readdir, readFile, writeFile, mkdir } from "node:fs/promises";
import { basename, join, resolve } from "node:path";

const SOUNDS_DIR = resolve(import.meta.dirname, "../public/sounds");
const OUTPUT_DIR = resolve(import.meta.dirname, "../public/sounds/waveforms");

// Decode MP3 to PCM samples using ffmpeg, then compute peaks
async function computeWaveform(mp3Path) {
  const { execFile } = await import("node:child_process");
  const { promisify } = await import("node:util");
  const exec = promisify(execFile);

  // Decode MP3 to raw PCM (signed 16-bit little-endian, stereo)
  const { stdout } = await exec(
    "ffmpeg",
    [
      "-i", mp3Path,
      "-f", "s16le",
      "-acodec", "pcm_s16le",
      "-ac", "2",
      "-ar", "22050",
      "-loglevel", "warning",
      "pipe:1",
    ],
    { encoding: "buffer", maxBuffer: 100 * 1024 * 1024 },
  );

  const samples = new Int16Array(stdout.buffer, stdout.byteOffset, stdout.byteLength / 2);

  // Interleaved stereo: [L, R, L, R, ...]
  // Average left and right channels, take absolute value
  const frameCount = samples.length / 2;
  const mono = new Float32Array(frameCount);
  for (let i = 0; i < frameCount; i++) {
    const left = Math.abs(samples[i * 2] / 32768);
    const right = Math.abs(samples[i * 2 + 1] / 32768);
    mono[i] = (left + right) / 2;
  }

  // Split into 100 chunks and compute mean of each
  const chunkSize = Math.ceil(mono.length / 100);
  const peaks = [];
  for (let i = 0; i < 100; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, mono.length);
    let sum = 0;
    for (let j = start; j < end; j++) {
      sum += mono[j];
    }
    peaks.push(sum / (end - start));
  }

  const max = Math.max(...peaks);

  return { max, peaks };
}

await mkdir(OUTPUT_DIR, { recursive: true });

const files = (await readdir(SOUNDS_DIR)).filter((f) => f.endsWith(".mp3"));

for (const file of files) {
  const id = basename(file, ".mp3");
  const outPath = join(OUTPUT_DIR, `${id}.json`);

  console.log(`computing: ${file}`);
  const waveform = await computeWaveform(join(SOUNDS_DIR, file));
  await writeFile(outPath, JSON.stringify(waveform));
}

console.log(`done: ${files.length} waveforms written to ${OUTPUT_DIR}`);
