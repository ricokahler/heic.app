import HeicWorker from './heic.worker';
import AsyncQueue from './AsyncQueue';
import DeferredPromise from './DeferredPromise';

const workerCount = 4;

function createWorkerPool() {
  const asyncQueue = new AsyncQueue();

  for (let i = 0; i < workerCount; i += 1) {
    asyncQueue.enqueue(new HeicWorker());
  }

  async function convert(heicBlob) {
    const base64Url = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(heicBlob);
      reader.addEventListener('loadend', () => {
        resolve(reader.result);
      });
      reader.addEventListener('error', reject);
    });

    const worker = await asyncQueue.dequeue();

    const jpgUrlPromise = new DeferredPromise();

    const handleMessage = e => {
      if (e.error) {
        jpgUrlPromise.reject(e.data.error);
      } else {
        jpgUrlPromise.resolve(e.data.url);
      }
    };

    worker.addEventListener('message', handleMessage);
    worker.postMessage(base64Url);

    try {
      const jpgUrl = await jpgUrlPromise;
      return jpgUrl;
    } catch (e) {
      throw e;
    } finally {
      worker.removeEventListener('message', handleMessage);
      asyncQueue.enqueue(worker);
    }
  }

  return { convert };
}

const workerPool = createWorkerPool();
export default workerPool;
