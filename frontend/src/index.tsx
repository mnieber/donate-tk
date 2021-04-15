import React from 'react';
import ReactDOM from 'react-dom';
import { App } from 'src/app/components';

import './index.css';
import 'src/donations/scss/styles.scss';
import 'slick-carousel/slick/slick.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
