import React, { useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { createStyles } from 'hacker-ui';
import useInterval from 'use-interval';

const useStyles = createStyles(({ css, theme }) => ({
  root: css`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
    pointer-events: none;
    z-index: ${theme.zIndex.tooltip + 1};
    display: flex;
    transition: opacity ${theme.durations.standard}ms;
  `,
  rootDragging: css`
    pointer-events: all;
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
  `,
  incoming: css`
    ${theme.fonts.h3};
    color: white;
    margin: auto;
  `,
}));

function WindowDropZone(props) {
  const { Root, styles, onNewImages } = useStyles(props);
  const [dragging, setDragging] = useState(false);
  const lastDragOverRef = useRef(0);

  useEffect(() => {
    const handleDragOver = e => {
      e.preventDefault();
      setDragging(true);
      lastDragOverRef.current = Date.now();
    };

    window.addEventListener('dragover', handleDragOver);
    return () => {
      window.removeEventListener('dragover', handleDragOver);
    };
  }, []);

  useInterval(() => {
    const lastDragOver = lastDragOverRef.current;
    if (Date.now() - lastDragOver > 500) {
      setDragging(false);
    }
  }, 200);

  useEffect(() => {
    const handleDrop = e => {
      e.preventDefault();

      const heicFiles = Array.from(e.dataTransfer.items)
        .filter(item => item.kind === 'file')
        .map(item => item.getAsFile())
        .filter(file => file.type === 'image/heic');

      onNewImages(heicFiles);

      setDragging(false);
    };

    window.addEventListener('drop', handleDrop);
    return () => {
      window.removeEventListener('drop', handleDrop);
    };
  }, [onNewImages]);

  return (
    <Root
      className={classNames({
        [styles.rootDragging]: dragging,
      })}
    >
      <div className={styles.incoming}>Incoming!</div>
    </Root>
  );
}

export default WindowDropZone;
