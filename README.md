# react-component-chunk

Library for making dynamic imports easy, with added support to make dynamically loaded [Redux](https://github.com/reactjs/redux/) Reducers and [Redux-Saga](https://github.com/redux-saga/redux-saga) Sagas easy. 

## Installation

```
npm i --save @kobalt/react-component-chunk
```

## Usage

Simply import `Chunkloader` from `@kobalt/react-component-chunk` and pass it a component to load

```js
import Chunkloader from '@kobalt/react-component-chunk';
  
const Component = Chunkloader({
    loadable: () => import('./components/ComponentIWantInAChunk'),
});
  
const App = () => (
    <SplittedComponent
        loader={ <Spinner /> }
    />
);
```

The component passed as `loader` will receive a `loading` and `error` prop, once the chunk is loaded the requested component will be rendered.

See [Examples](#examples) for information on how to load multiple components, reducers and sagas.

### Usage with [Redux](https://github.com/reactjs/redux/) and [Redux-Saga](https://github.com/redux-saga/redux-saga)

You may want to include some specific reducers and/or sagas in your import, react-component-chunk can help you inject these.
(Note: [Redux-Saga](https://github.com/redux-saga/redux-saga) is **only** required if you plan to inject sagas)

For this to work you need to have applied the `injectableReducers` createStore enhancer

```js
// storeInitializer.js
import { createStore, compose } from 'redux';
import injector from '@kobalt/react-component-chunk/redux';
  
const store = createStore(
    // Your reducers should _NOT_ be combined but a plain object. injectableReducers will do this for you.
    reducers,
    compose(
        // ...your other enhancers
        injector(),
    ),
);

```

To do this you need to wrap the component you are importing with the `Injector`-HOC

```js
// components/ComponentIWantInAChunk.js
import { Injector } from '@kobalt/react-component-chunk'
import myReducer from '../reducers/myReducer';
import mySaga from '../sagas/mySaga';

const ComponentIWantInAChunk = () => (
    <p>You want me in a chunk!</p>
);
  
export default Injector({
    reducers: {
        myReducer,
    },
    sagas: [
        mySaga,
    ],
})(ComponentIWantInAChunk);
```

## [Examples](#examples)

### Loading a single component

```js
import Chunkloader from '@kobalt/react-component-chunk';
import Spinner from './components/Spinner';
  
const SplittedComponent = Chunkloader({
    loadable: () => import('./components/ComponentIWantInAChunk'),
});
  
const App = () => (
    <SplittedComponent
        loader={ <Spinner /> }
    />
);
```

### Loading multiple components

```js
import Chunkloader from '@kobalt/react-component-chunk';
import Spinner from './components/Spinner';
  
const SplittedComponents = Chunkloader({
    loadable: [
        () => import('./components/ComponentIWantInAChunk'),
        () => import('./components/ComponentIAlsoWantInAChunk'),
    ],
});
  
const App = () => (
    <SplittedComponents
        loader={ <Spinner /> }
    >
        { (ComponentIWantInAChunk, ComponentIAlsoWantInAChunk) => (
            <div>
                <ComponentIWantInAChunk />
                <ComponentIAlsoWantInAChunk />
            </div>
        ) }
    </SplittedComponents>
);
```
