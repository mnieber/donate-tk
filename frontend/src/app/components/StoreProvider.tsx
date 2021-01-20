import React from 'react';
import { AppStore } from 'src/app/AppStore'

const appStore = new AppStore();

const StoreContext = React.createContext<AppStore>(appStore);

export const StoreProvider: React.FC = ({ children }) => {
  return (
    <StoreContext.Provider value={appStore}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const store = React.useContext(StoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return store;
};
