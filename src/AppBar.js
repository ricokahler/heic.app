import React from 'react';
import { createStyles, Button, Tooltip } from 'hacker-ui';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';

const useStyles = createStyles(({ css, theme }) => ({
  root: css`
    height: ${theme.block(0.75)};
    border-bottom: 1px solid ${theme.colors.bland};
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: ${theme.space(1)};
  `,
}));

function AppBar(props) {
  const { Root } = useStyles(props);
  return (
    <Root>
      <Tooltip title="Contribute on GitHub" position="left">
        {tooltipProps => (
          <Button
            shape="icon"
            color="black"
            component={props => (
              // eslint-disable-next-line jsx-a11y/anchor-has-content
              <a
                href="https://github.com/ricokahler/heic.app"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
                {...tooltipProps}
              />
            )}
          >
            <FontAwesomeIcon icon={faGithub} size="lg" />
          </Button>
        )}
      </Tooltip>
    </Root>
  );
}

export default AppBar;
