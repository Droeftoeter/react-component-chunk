import React from 'react';
import { Injector } from '@kobalt/react-component-chunk';

import myReducer from '../reducers/chunk';

const Component = () => (
    <p>I am a chunked component!</p>
);

export default Injector({
    reducers: {
        myReducer,
    },
})(Component);
