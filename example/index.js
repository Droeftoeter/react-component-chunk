import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Chunkloader from '@kobalt/react-component-chunk';

import createStore from './createStore';
import Loading from './components/Loading';

const store = createStore();

const Chunk = Chunkloader({
    loadable: [
        () => import('./components/Chunk'),
        () => import('./components/Chunk2'),
    ],
});

ReactDOM.render(
    <Provider store={ store }>
        <div>
            <Chunk
                loading={ Loading }
            >
                { (FirstComponent, SecondComponent) => (
                    <div>
                        <FirstComponent />
                        <SecondComponent />
                    </div>
                ) }
            </Chunk>
        </div>
    </Provider>,
    document.getElementById('react-container'),
);
