/* eslint-disable no-restricted-globals */
import * as Sentry from '@sentry/browser';
import heicToJpegDataUrl from './heicToJpegDataUrl';

Sentry.init({
  dsn: 'https://e0f2505d220c46b29a91ff4b6a2b6bc4@sentry.io/2169844',
});

self.addEventListener('message', async e => {
  try {
    const jpegDataUrl = await heicToJpegDataUrl(e.data);
    postMessage({ url: jpegDataUrl });
  } catch (e) {
    postMessage({ error: e && e.message });
  }
});
