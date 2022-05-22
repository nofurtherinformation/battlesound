import React, { useState, useContext } from 'react';
import debounce from 'lodash.debounce';

const ViewportContext = React.createContext();
const SetViewportContext = React.createContext();

/* Wrap your app in this bad boy */
export const ViewportProvider = ({ defaultViewport = {}, children }) => {
  const [viewport, setViewport] = useState(defaultViewport);

  const handleViewport = debounce((viewport) => {
    setViewport(viewport)
  }, 4);

  return (
    <ViewportContext.Provider value={viewport}>
      <SetViewportContext.Provider value={handleViewport}>
        {children}
      </SetViewportContext.Provider>
    </ViewportContext.Provider>
  );
};

/** Read the viewport from anywhere */
export const useViewport = () => {
  const ctx = useContext(ViewportContext);
  if (!ctx) throw Error('Not wrapped in <ViewportProvider />.');
  return ctx;
};

/** Update the viewport from anywhere */
export const useSetViewport = () => {
  const ctx = useContext(SetViewportContext);
  if (!ctx) throw Error('Not wrapped in <ViewportProvider />.');
  return ctx;
};