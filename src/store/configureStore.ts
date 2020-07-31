/**
 * Create the store with dynamic reducers
 */

import {
  configureStore,
  getDefaultMiddleware,
  Middleware,
} from '@reduxjs/toolkit';
import { createInjectorsEnhancer, forceReducerReload } from 'redux-injectors';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import { History } from 'history';
import { actions as RegistrationPageActions } from 'app/containers/RegistrationPage/slice';
import { actions as LoginPageActions } from 'app/containers/LoginPage/slice';

import { createReducer } from './reducers';

export function configureAppStore(history?: History) {
  const reduxSagaMonitorOptions = {};
  const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);
  const { run: runSaga } = sagaMiddleware;

  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [sagaMiddleware] as Middleware[];

  if (history) {
    middlewares.push(routerMiddleware(history));
  }

  const enhancers = [
    createInjectorsEnhancer({
      createReducer,
      runSaga,
    }),
  ];

  const store = configureStore({
    reducer: createReducer(),
    middleware: [
      ...getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            RegistrationPageActions.changeInputAction.type,
            LoginPageActions.changeInputAction.type,
          ],
        },
      }),
      ...middlewares,
    ],
    devTools: process.env.NODE_ENV !== 'production',
    enhancers,
  });

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      forceReducerReload(store);
    });
  }

  return store;
}
