// import { combineReducers, configureStore } from '@reduxjs/toolkit';
// import { persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';

// import themeReducer from "./themeSlice";

// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['theme'], // persist only theme
// };

// const rootReducer = combineReducers({
//   theme: themeReducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false
//     })
// });
