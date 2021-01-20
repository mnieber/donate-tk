import React from 'react';
import ReactDOM from 'react-dom';
import { App } from 'src/app/components';
import reportWebVitals from './reportWebVitals';

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
