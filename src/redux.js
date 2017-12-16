import invariant from 'invariant';
import { combineReducers } from 'redux';

/**
 * Adds stubs for non-existing reducers
 * Thanks to Adam Rackis <https://medium.com/@adamrackis>
 *
 * @param reducers
 * @param initialState
 */
function combineReducersWithStubs(reducers, initialState = {}) {
    const stubs = {};

    Object.keys(initialState).forEach(stateKey => {
        if (!(stateKey in reducers)) {
            stubs[ stateKey ] = state => (
                typeof state === 'undefined' ? null : state
            );
        }
    });

    return combineReducers({
        ...reducers,
        ...stubs,
    });
}

/**
 * Make sure the passed in reducer is an object, else turn it into an object.
 *
 * @param reducer
 */
function getReducerObject(reducer) {
    if (typeof reducer === 'function') {
        invariant(
            reducer.name !== 'combination',
            'Pass reducers as object, react-component-chunk will apply combineReducers',
        );

        return {
            [ reducer.name ]: reducer,
        };
    }

    return {
        ...reducer,
    };
}

/**
 * Enhanced createStore, will add a injectReducers and injectSagas function.
 *
 * @param sagaMiddleware
 */
export default function createInjectableStore(sagaMiddleware) {
    return next => (reducer, preloadedState, enhancer) => {
        const reducers = getReducerObject(reducer);

        const store = next(
            combineReducersWithStubs(reducers, preloadedState),
            preloadedState,
            enhancer,
        );

        const injectReducers = injectables => {
            if (typeof injectables === 'function') {
                reducers[ injectables.name ] = injectables;
            } else {
                Object.keys(injectables).forEach(key => {
                    reducers[ key ] = injectables[ key ];
                });
            }

            store.replaceReducer(combineReducersWithStubs(
                reducers,
                store.getState(),
            ));
        };

        const injectSagas = injectables => {
            invariant(
                sagaMiddleware,
                'Provide the sagaMiddleware as argument to the injector store enhancer to inject sagas',
            );

            if (typeof injectables === 'function') {
                sagaMiddleware.run(injectables);
            } else if (Array.isArray(injectables)) {
                injectables.forEach(saga => {
                    sagaMiddleware.run(saga);
                });
            } else {
                Object.keys(injectables).forEach(key => {
                    sagaMiddleware.run(injectables[ key ]);
                });
            }
        };

        return {
            ...store,
            injectReducers,
            injectSagas,
        };
    };
}
