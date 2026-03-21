export function getImagePath(imageId: string): string {
  return `/images/${imageId}.avif`;
}

const IMAGE_WIDTHS = [320, 640, 960, 1280] as const;

export function getImageSrcSet(imageId: string): string {
  return IMAGE_WIDTHS.map((w) => (w === 1280 ? `/images/${imageId}.avif ${w}w` : `/images/${imageId}_w${w}.avif ${w}w`)).join(", ");
}

export function getMoviePath(movieId: string): string {
  return `/movies/${movieId}.mp4`;
}

export function getSoundPath(soundId: string): string {
  return `/sounds/${soundId}.mp3`;
}

export function getProfileImagePath(profileImageId: string): string {
  return `/images/profiles/${profileImageId}.avif`;
}
