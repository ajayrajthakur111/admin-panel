// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice'; // We'll create this next
import dashboardReducer from './features/dashboard/dashboardSlice'; // Will create later
import articleReducer from './features/article/articleSlice'; // Import the new reducer
import autoDealershipReducer from './features/autoDealership/autoDealershipSlice'; // Import the new reducer

export const store = configureStore({
    
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    article: articleReducer, 
    autoDealership: autoDealershipReducer, 
  },
});