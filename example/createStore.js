import { createStore, compose } from 'redux';
import injectableReducers from '../src/redux';

export default function getStore(initialState = {}) {
    const enhancer = compose(
        window.devToolsExtension ? window.devToolsExtension() : f => f,
    );

    const singularReducer = state => typeof state === 'undefined' ? null : state;
    const finalCreateStore = injectableReducers()(createStore);

    return finalCreateStore(
        singularReducer,
        initialState,
        enhancer,
    );
}
