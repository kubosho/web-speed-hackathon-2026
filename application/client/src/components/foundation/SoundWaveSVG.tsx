import { useEffect, useRef, useState } from "react";

import { fetchJSON } from "@web-speed-hackathon-2026/client/src/utils/fetchers";

interface WaveformData {
  max: number;
  peaks: number[];
}

interface Props {
  soundId: string;
}

export const SoundWaveSVG = ({ soundId }: Props) => {
  const uniqueIdRef = useRef(Math.random().toString(16));
  const [{ max, peaks }, setData] = useState<WaveformData>({
    max: 0,
    peaks: [],
  });

  useEffect(() => {
    fetchJSON<WaveformData>(`/sounds/waveforms/${soundId}.json`).then(setData);
  }, [soundId]);

  return (
    <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 1">
      {peaks.map((peak, idx) => {
        const ratio = peak / max;
        return (
          <rect
            key={`${uniqueIdRef.current}#${idx}`}
            fill="var(--color-cax-accent)"
            height={ratio}
            width="1"
            x={idx}
            y={1 - ratio}
          />
        );
      })}
    </svg>
  );
};
