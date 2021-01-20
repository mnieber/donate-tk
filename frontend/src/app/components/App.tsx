import React from 'react';

import './App.scss';
import { UrlRouter } from 'src/app/components/UrlRouter';

export function App() {
  return (
    <div className="App w-screen">
      <header className="App-header">
        <UrlRouter />
      </header>
    </div>
  );
}

export default App;
