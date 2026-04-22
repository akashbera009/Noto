import { configureStore, Middleware } from '@reduxjs/toolkit';
import { createLogger } from 'redux-logger';
import authReducer, { clearAuth } from '../modules/auth/authSlice';
import notesReducer from '../modules/notes/notesSlice';

const logger = createLogger({
  collapsed: true,
});

/**
 * Middleware to handle unauthorized errors (401) from the API.
 * If a request fails with 401 and refresh also failed, clear the auth state.
 */
const unauthorizedMiddleware: Middleware = ({ dispatch }) => next => action => {
  if (
    typeof action === 'object' &&
    action !== null &&
    'payload' in action &&
    typeof action.payload === 'object' &&
    action.payload !== null &&
    'status' in (action.payload as any) &&
    (action.payload as any).status === 401
  ) {
    dispatch(clearAuth());
  }
  return next(action);
};

const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
  },
  middleware: getDefaultMiddleware => {
    const middlewares = getDefaultMiddleware({
      serializableCheck: false,
    });

    middlewares.push(unauthorizedMiddleware);

    if (__DEV__) {
      middlewares.push(logger);
    }

    return middlewares;
  },
});

export type AppDispatch = typeof store.dispatch;
export type AppRootState = ReturnType<typeof store.getState>;

export default store;