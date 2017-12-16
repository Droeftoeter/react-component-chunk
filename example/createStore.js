import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import injectableReducers from '../src/redux';

export default function getStore(initialState = {}) {
    const sagaMiddleware = createSagaMiddleware();

    const enhancer = compose(
        window.devToolsExtension ? window.devToolsExtension() : f => f,
        injectableReducers(sagaMiddleware),
        applyMiddleware(sagaMiddleware),
    );

    const singularReducer = state => typeof state === 'undefined' ? null : state;

    return createStore(
        singularReducer,
        initialState,
        enhancer,
    );
}
