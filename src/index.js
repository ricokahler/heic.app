import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { useCssReset, ThemeProvider, createTheme } from 'hacker-ui';
import './index.css';
import App from './App';

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
