import React, { Component } from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';

import getDefaultExport from './helpers/getDefaultExport';

export Injector from './Injector';

export default function chunkLoadable(options) {
    let promise;

    return class Chunk extends Component {
        static propTypes = {
            component: PropTypes.element,
            render:    PropTypes.func,
            children:  PropTypes.func,
            loading:   PropTypes.oneOfType([
                PropTypes.element,
                PropTypes.func,
            ]).isRequired,
        };

        static defaultProps = {
            component: undefined,
            render:    undefined,
            children:  undefined,
        };

        static resolve() {
            if (promise) {
                return promise;
            }

            const promises = [];

            if (typeof options.loadable === 'function') {
                promises.push(options.loadable());
            } else {
                options.loadable.forEach(loadable => {
                    promises.push(loadable());
                });
            }

            promise = Promise.all(promises);
            return promise;
        }

        state = {
            loading: true,
            loaded:  false,
            error:   undefined,
        };

        componentWillMount() {
            this.mounted = true;

            Chunk.resolve().then(res => {
                if (!this.mounted) {
                    return;
                }

                this.setState({
                    loaded:  res.map(result => getDefaultExport(result)),
                    loading: false,
                });
            }).catch(error => {
                if (!this.mounted) {
                    return;
                }

                this.setState({
                    loading: false,
                    error,
                });
            });
        }

        componentWillUnmount() {
            this.mounted = false;
        }

        render() {
            const {
                loaded,
                loading,
                error,
            } = this.state;

            if (loaded) {
                if (this.props.component) {
                    return React.createElement(this.props.component, {
                        children: this.props.children,
                        loaded,
                    });
                }

                if (this.props.render) {
                    return this.props.render(...loaded);
                }

                if (typeof this.props.children === 'function') {
                    return this.props.children(...loaded);
                }

                if (loaded.length === 1 && typeof loaded[ 0 ] === 'function') {
                    return React.createElement(loaded[ 0 ]);
                }

                invariant(
                    false,
                    'Specify either the component prop, the render prop or pass a function as child',
                );
            } else if (loading || error) {
                return React.createElement(this.props.loading, {
                    loading,
                    error,
                });
            }

            return null;
        }
    };
}
