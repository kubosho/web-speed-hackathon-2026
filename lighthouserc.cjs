const baseUrl = process.env.LHCI_BASE_URL || 'http://localhost:3000';

/** @type {import('@lhci/types').LHCI.SharedFlagsConfig} */
module.exports = {
  ci: {
    collect: {
      url: [
        `${baseUrl}/`,
        `${baseUrl}/posts/ff93a168-ea7c-4202-9879-672382febfda`,
        `${baseUrl}/posts/fe6712a1-d9e4-4f6a-987d-e7d08b7f8a46`,
        `${baseUrl}/posts/fff790f5-99ea-432f-8f79-21d3d49efd1a`,
        `${baseUrl}/posts/fefe75bd-1b7a-478c-8ecc-2c1ab38b821e`,
        `${baseUrl}/search`,
        `${baseUrl}/terms`,
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless --disable-gpu',
        preset: 'desktop',
      },
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        // Start with warnings only — tighten thresholds as performance improves
        'categories:performance': ['warn', { minScore: 0.3 }],
        'categories:accessibility': ['warn', { minScore: 0.7 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
