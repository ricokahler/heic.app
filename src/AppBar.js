import React from 'react';
import { createStyles } from 'hacker-ui';

const useStyles = createStyles(({ css, theme }) => ({
  root: css`
    height: ${theme.block(0.75)};
    border-bottom: 1px solid ${theme.colors.bland};
  `,
}));

function AppBar(props) {
  const { Root, styles } = useStyles(props);
  return <Root></Root>;
}

export default AppBar;
