import React from 'react';
import classNames from 'classnames';
import { darken } from 'polished';
import { Link, useRouteMatch } from 'react-router-dom';
import { createStyles, List, ListItemButton, Button, useTheme, Tooltip } from 'hacker-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faCircleNotch,
  faPlus,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';

const useStyles = createStyles(({ css, theme }) => {
  const backgroundColor = darken(0.03, theme.colors.surface);

  return {
    root: css`
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background-color: ${backgroundColor};
    `,
    header: css`
      display: flex;
      flex-direction: column;
      padding: ${theme.space(1)};
      flex: 0 0 auto;
      overflow: hidden;
      height: ${theme.block(0.75)};
      border-bottom: 1px solid ${theme.colors.bland};
    `,
    title: css`
      ${theme.fonts.h5};
      margin: 0;
    `,
    subtitle: css`
      ${theme.fonts.caption};
      margin: 0;
    `,
    upload: css`
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      padding: ${theme.space(1)};
      border-bottom: 1px solid ${theme.colors.bland};
      & > *:not(:last-child) {
        margin-right: ${theme.space(0.5)};
      }
    `,
    uploadInput: css`
      height: 1px;
      width: 1px;
      opacity: 0;
      pointer-events: none;
      position: absolute;
    `,
    uploadButton: css`
      border-radius: 999999px;
    `,
    list: css`
      flex: 1 1 auto;
      overflow: auto;
      margin: 0;
    `,
    empty: css`
      flex: 1 1 auto;
      overflow: auto;
      margin: 0;
      display: flex;
      padding: ${theme.gap(1)};
    `,
    emptyText: css`
      ${theme.fonts.body1};
      font-weight: bold;
      margin: auto;
      margin-top: ${theme.gap(1)};
      color: ${darken(0.5, backgroundColor)};
      text-align: center;
    `,
    item: css`
      flex-direction: row;
      align-items: center;
    `,
    itemActive: css`
      background-color: ${darken(0.09, backgroundColor)};

      &:focus {
        background-color: ${darken(0.07, backgroundColor)};
      }
      &:hover {
        background-color: ${darken(0.05, backgroundColor)};
      }
      &:active {
        background-color: ${darken(0.03, backgroundColor)};
      }
    `,
    itemInfo: css`
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      margin-right: ${theme.space(1)};
      overflow: hidden;
    `,
    itemTitle: css`
      ${theme.fonts.body1};
    `,
    itemCaption: css`
      ${theme.fonts.caption};
    `,
    itemIcon: css`
      flex: 0 0 auto;
    `,
    itemIconSpin: css`
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
  };
});

function SideBar(props) {
  const { Root, styles, images, onNewImages, onDownload } = useStyles(props);
  const theme = useTheme();
  const currentImageId = useRouteMatch({ path: '/:currentImageId?' })?.params?.currentImageId;

  const handleChange = e => {
    const files = Array.from(e.currentTarget.files);
    if (!files.length) return;
    onNewImages(files);
  };

  return (
    <Root>
      <div className={styles.header}>
        <h1 className={styles.title}>heic.app</h1>
        <p className={styles.subtitle}>The free HEIC converter</p>
      </div>
      <div className={styles.upload}>
        <Button
          className={styles.uploadButton}
          variant="filled"
          size="large"
          component={props => <label htmlFor="image-upload" {...props} />}
        >
          <span>Upload</span>
          <FontAwesomeIcon icon={faPlus} />
        </Button>
        <input
          className={styles.uploadInput}
          id="image-upload"
          type="file"
          accept="image/heic"
          multiple
          onChange={handleChange}
        />
        <Tooltip title="Download images">
          {props => (
            <Button
              shape="icon"
              color={theme.colors.bland}
              size="large"
              onClick={onDownload}
              disabled={!images.every(image => !!image.url) || images.length <= 0}
              {...props}
            >
              <FontAwesomeIcon icon={faDownload} />
            </Button>
          )}
        </Tooltip>
      </div>
      {images.length <= 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyText}>Your uploaded images will appear here.</div>
        </div>
      ) : (
        <List className={styles.list}>
          {images.map(image => (
            <li key={image.id}>
              <ListItemButton
                className={classNames(styles.item, {
                  [styles.itemActive]: currentImageId === image.id,
                })}
                component={props => <Link to={`/${image.id}`} {...props} />}
              >
                <div className={styles.itemInfo}>
                  <div className={styles.itemTitle}>{image.name}</div>
                  <div className={styles.itemCaption}>
                    Uploaded at {new Date(image.created).toLocaleTimeString()}
                  </div>
                </div>

                <FontAwesomeIcon
                  className={classNames(styles.itemIcon, {
                    [styles.itemIconSpin]: !image.url,
                  })}
                  icon={image.url ? faChevronRight : faCircleNotch}
                />
              </ListItemButton>
            </li>
          ))}
        </List>
      )}
    </Root>
  );
}

export default SideBar;
