import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import invariant from 'invariant';

export default function wrap({ reducers, sagas }) {
    let injected = false;
    return function wrapComponent(WrappedComponent) {
        class Injector extends Component {
            static propTypes = {
                innerRef: PropTypes.func,
            };

            static defaultProps = {
                innerRef: undefined,
            };

            static contextTypes = {
                store: PropTypes.shape({
                    injectReducers: PropTypes.func,
                    injectSagas:    PropTypes.func,
                }),
            };

            /**
             * Inject the reducers and sagas on mount
             */
            componentWillMount() {
                if (injected === true) {
                    return;
                }

                if (reducers && Object.keys(reducers).length > 0) {
                    invariant(
                        this.context.store && this.context.store.injectReducers,
                        'No store or no injectReducers function on store. Make sure the store is enhanced with the injector enhancer',
                    );

                    this.context.store.injectReducers(reducers);
                }

                if (sagas && (typeof sagas === 'function' || sagas.length > 0)) {
                    invariant(
                        this.context.store && this.context.store.injectSagas,
                        'No store or no injectSagas function on store. Make sure the store is enhanced with the injector enhancer',
                    );

                    this.context.store.injectSagas(sagas);
                }

                injected = true;
            }

            render() {
                if (this.props.innerRef) {
                    return React.createElement(WrappedComponent, {
                        ref: this.props.innerRef,
                    });
                }

                return React.createElement(WrappedComponent);
            }
        }

        return hoistStatics(Injector, WrappedComponent);
    };
}
