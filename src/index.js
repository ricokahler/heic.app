import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { useCssReset, ThemeProvider, createTheme } from 'hacker-ui';
import * as Sentry from '@sentry/browser';

import './index.css';
import App from './App';

Sentry.init({ dsn: 'https://e0f2505d220c46b29a91ff4b6a2b6bc4@sentry.io/2169844' });

const container = document.createElement('div');
container.classList.add('container');
document.body.appendChild(container);

const theme = createTheme();

function Container({ children }) {
  useCssReset();
  return children;
}

render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <Container>
        <App />
      </Container>
    </ThemeProvider>
  </BrowserRouter>,
  container,
);
