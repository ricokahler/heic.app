import { libheif } from 'libheif-js';

const decoder = new libheif.HeifDecoder();

function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * give it a heic base64 string and it returns a JPEG data URL
 * @return {Promise<string>}
 */
async function heicToJpegDataUrl(dataUrl) {
  if (!dataUrl.startsWith('data:image/heic;base64,')) {
    throw new Error('expected heic base64 string');
  }

  const inputBuffer = base64ToArrayBuffer(dataUrl.substring('data:image/heic;base64,'.length));
  const data = decoder.decode(inputBuffer);

  const image = data[0];
  const width = image.get_width();
  const height = image.get_height();

  const outputBuffer = await new Promise((resolve, reject) => {
    image.display(
      { data: new Uint8ClampedArray(width * height * 4), width, height },
      displayData => {
        if (!displayData) {
          return reject(new Error('HEIF processing error'));
        }

        // get the ArrayBuffer from the Uint8Array
        resolve(displayData.data.buffer);
      },
    );
  });

  const canvas = new OffscreenCanvas(width, height);
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext('2d');
  const imgData = context.createImageData(width, height);

  // const outputBuffer = new ArrayBuffer(4 * width * height);
  const ubuf = new Uint8Array(outputBuffer);
  for (let i = 0; i < ubuf.length; i += 4) {
    imgData.data[i] = ubuf[i]; //red
    imgData.data[i + 1] = ubuf[i + 1]; //green
    imgData.data[i + 2] = ubuf[i + 2]; //blue
    imgData.data[i + 3] = ubuf[i + 3]; //alpha
  }

  context.putImageData(imgData, 0, 0);

  const convertToBlob = canvas.convertToBlob
    ? canvas.convertToBlob.bind(canvas)
    : canvas.toBlob.bind(canvas);

  const blob = await convertToBlob({ type: 'image/jpeg' });
  const outputDataUrl = URL.createObjectURL(blob);
  return outputDataUrl;
}

export default heicToJpegDataUrl;
