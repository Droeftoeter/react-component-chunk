import React from 'react';
import PropTypes from 'prop-types';

const Loading = ({ loading, error }) => (
    error ? <p>Error: { error } </p> : <p>Loading...</p>
);

Loading.propTypes = {
    loading: PropTypes.bool,
    error:   PropTypes.any,
};

Loading.defaultProps = {
    loading: false,
    error:   undefined,
};

export default Loading;
