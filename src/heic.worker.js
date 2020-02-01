/* eslint-disable no-restricted-globals */
import heicToJpegDataUrl from './heicToJpegDataUrl';

self.addEventListener('message', async e => {
  try {
    const jpegDataUrl = await heicToJpegDataUrl(e.data);
    postMessage({ url: jpegDataUrl });
  } catch (e) {
    postMessage({ error: e && e.message });
  }
});
