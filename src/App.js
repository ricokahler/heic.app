import React, { useState, useEffect } from 'react';
import {
  createStyles,
  Button,
  useTheme,
  Modal,
  ModalHeader,
  ModalFooter,
  ModalActions,
  Anchor,
} from 'hacker-ui';
import { useRouteMatch, useHistory } from 'react-router-dom';
import shortId from 'shortid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import JsZip from 'jszip';
import download from 'downloadjs';
import SideBar from './SideBar';
import AppBar from './AppBar';
import WindowDropZone from './WindowDropZone';
import heicWorkerPool from './heicWorkerPool';

const useStyles = createStyles(({ css, theme }) => ({
  root: css`
    display: flex;
    overflow: hidden;
    height: 100%;
  `,
  sideBar: css`
    flex: 0 0 auto;
    width: ${theme.block(2.5)};
    overflow: hidden;
  `,
  content: css`
    flex: 1 1 auto;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  `,
  appBar: css`
    flex: 0 0 auto;
  `,
  imageContainer: css`
    position: relative;
    flex: 1 1 auto;
    display: flex;
    overflow: hidden;
    padding: ${theme.gap(1)};
    position: relative;
    & > * {
      margin: auto;
    }
  `,
  image: css`
    object-fit: contain;
    width: 100%;
    height: 100%;
    filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.3))
      drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.3));
  `,
  empty: css`
    display: flex;
    flex-direction: column;
  `,
  emptyTitle: css`
    ${theme.fonts.h3};
    margin: 0;
    text-align: center;
  `,
  emptySubtitle: css`
    ${theme.fonts.h4};
    font-weight: 400;
    margin: 0;
    text-align: center;
  `,
  spinner: css`
    animation: spin 3s linear infinite;

    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `,
  moreButton: css`
    position: absolute;
    top: ${theme.space(1)};
    right: ${theme.space(1)};
    z-index: 1;
  `,
  modal: css`
    width: ${theme.block(4)};
  `,
  modalTitle: css`
    ${theme.fonts.h5};
  `,
}));

function App(props) {
  const { Root, styles } = useStyles(props);
  const [images, setImages] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [browserMessageOpen, setBrowserMessageOpen] = useState(
    !window.OffscreenCanvas,
  );
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [idToDelete, setIdToDelete] = useState('');
  const history = useHistory();
  const theme = useTheme();
  const currentImageId = useRouteMatch({ path: '/:currentImageId' })?.params
    ?.currentImageId;
  const [photoWarning, setPhotoWarning] = useState(false);

  const over100Photos = images.length > 100;

  useEffect(() => {
    if (over100Photos) {
      setPhotoWarning(true);
    }
  }, [over100Photos]);

  /**
   * @param {File[]} files
   */
  const handleNewImages = async files => {
    const imageObjects = files.map(file => {
      const id = `${encodeURIComponent(file.name).replace(
        /\./g,
        '-',
      )}-${shortId()}`;
      return {
        id,
        name: file.name,
        created: Date.now(),
        url: undefined,
        file,
      };
    });

    setImages(images => [...images, ...imageObjects]);

    for (const imageObject of imageObjects) {
      heicWorkerPool.convert(imageObject.file).then(url => {
        setImages(images =>
          images.map(image =>
            imageObject.id === image.id ? { ...image, url } : image,
          ),
        );
      });
    }

    const last = imageObjects[imageObjects.length - 1];
    if (!last) return;
    history.push(`/${last.id}`);
  };

  const currentImage = images.find(image => image.id === currentImageId);

  const handleDelete = () => {
    setImages(images => images.filter(image => image.id !== idToDelete));
    history.push('/');
    setIdToDelete('');
  };

  const handleDownload = async () => {
    setDownloading(true);
    const resolvedImages = await Promise.all(
      images
        .filter(image => !!image.url)
        .map(async image => {
          const response = await fetch(image.url);
          const blob = await response.blob();
          return { ...image, blob };
        }),
    );

    const deDupedFileNames = Object.values(
      resolvedImages.reduce((acc, next) => {
        if (acc[next.name]) {
          const newName = `${next.name}-${shortId()}`;
          acc[newName] = next;
        } else {
          acc[next.name] = next;
        }

        return acc;
      }, {}),
    );

    const zip = new JsZip();

    for (const file of deDupedFileNames) {
      zip.file(file.name.replace(/\.heic$/, '.jpg'), file.blob);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    download(zipBlob, `heic-app-${new Date().toISOString()}.zip`);
    setDownloading(false);
    setDownloadDialogOpen(false);
  };

  return (
    <>
      <WindowDropZone onNewImages={handleNewImages} />

      <Root>
        <SideBar
          className={styles.sideBar}
          images={images}
          onNewImages={handleNewImages}
          onDownload={() => setDownloadDialogOpen(true)}
        />

        <div className={styles.content}>
          <AppBar className={styles.appBar} />
          <div className={styles.imageContainer}>
            {currentImage ? (
              currentImage.url ? (
                <>
                  <Button
                    className={styles.moreButton}
                    color={theme.colors.bland}
                    shape="icon"
                    onClick={() => setIdToDelete(currentImage.id)}
                  >
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </Button>
                  <img
                    className={styles.image}
                    src={currentImage.url}
                    alt={currentImage.name}
                  />
                </>
              ) : (
                <FontAwesomeIcon
                  className={styles.spinner}
                  icon={faCircleNotch}
                  size="3x"
                />
              )
            ) : (
              <div className={styles.empty}>
                <p className={styles.emptyTitle}>Nothing here yet.</p>
                <p className={styles.emptySubtitle}>
                  Drop any .heic files anywhere on this window.
                </p>
              </div>
            )}
          </div>
        </div>
      </Root>

      <Modal
        className={styles.modal}
        open={!!idToDelete}
        onClose={() => setIdToDelete('')}
      >
        <ModalHeader>
          <h1 className={styles.modalTitle}>
            Are you sure you want to remove this picture?
          </h1>
        </ModalHeader>
        <p>This action cannot be undone.</p>
        <ModalFooter>
          <ModalActions>
            <Button
              color={theme.colors.bland}
              onClick={() => setIdToDelete('')}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              color={theme.colors.danger}
              onClick={handleDelete}
            >
              Delete
            </Button>
          </ModalActions>
        </ModalFooter>
      </Modal>

      <Modal
        className={styles.modal}
        open={downloadDialogOpen}
        onClose={() => {
          if (downloading) return;
          setDownloadDialogOpen(false);
        }}
      >
        <ModalHeader>
          <h1 className={styles.modalTitle}>Download converted images.</h1>
        </ModalHeader>
        <p>
          Pressing Download will download a zip folder of the files you've
          uploaded.
        </p>
        <ModalFooter>
          <ModalActions>
            <Button
              color={theme.colors.bland}
              disabled={downloading}
              onClick={() => setDownloadDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="filled"
              color={theme.colors.brand}
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading ? 'Downloading…' : 'Download'}
            </Button>
          </ModalActions>
        </ModalFooter>
      </Modal>

      <Modal
        open={browserMessageOpen}
        onClose={() => setBrowserMessageOpen(false)}
        className={styles.modal}
      >
        <ModalHeader>
          <h1 className={styles.modalTitle}>
            Sorry, your browser is not supported. Try Chrome or the new Edge.
          </h1>
        </ModalHeader>
        <p>
          heic.app requires that your browser supports{' '}
          <Anchor
            href="https://caniuse.com/#feat=offscreencanvas"
            target="_blank"
            rel="noopener noreferrer"
          >
            OffscreenCanvas
          </Anchor>
          .
        </p>
        <ModalFooter>
          <ModalActions>
            <Button
              variant="filled"
              color={theme.colors.brand}
              onClick={() => setBrowserMessageOpen(false)}
            >
              Okay
            </Button>
          </ModalActions>
        </ModalFooter>
      </Modal>

      <Modal
        open={photoWarning}
        onClose={() => setPhotoWarning(false)}
        className={styles.modal}
      >
        <ModalHeader>
          <h1 className={styles.modalTitle}>Whoa, there!</h1>
        </ModalHeader>
        <p>That's a lot of photos.</p>
        <p>
          For the best performance, try to stay around 100 photos per session.
        </p>
        <ModalFooter>
          <ModalActions>
            <Button
              variant="filled"
              color={theme.colors.brand}
              onClick={() => setPhotoWarning(false)}
            >
              Okay
            </Button>
          </ModalActions>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default App;
