import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "./context/ThemeContext";


// import { Provider } from 'react-redux';
// import { store } from './components/redux/store'; 
// // or:  './redux/store'   (depending on your folder)

// import { PersistGate } from "redux-persist/integration/react";
// import { persistStore } from "redux-persist";

// const persistor = persistStore(store);

createRoot(document.getElementById('root')).render(
  <StrictMode>
     {/* <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}> */}

       <ThemeProvider>
    <App />

     </ThemeProvider>
          {/* </PersistGate>
    </Provider> */}

  </StrictMode>,
)
