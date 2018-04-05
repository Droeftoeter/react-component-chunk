import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistNonReactStatics from 'hoist-non-react-statics';
import invariant from 'invariant';

export default function ({ reducers, sagas }) {
    let injected = false;

    return function injector(WrappedComponent) {
        class Injector extends Component {

            static propTypes = {
                forwardRef: PropTypes.object,
            };

            static defaultProps = {
                forwardRef: undefined,
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
                if (this.props.forwardRef) {
                    return React.createElement(WrappedComponent, {
                        ref: this.props.forwardRef,
                    });
                }

                return React.createElement(WrappedComponent);
            }
        }

        hoistNonReactStatics(Injector, WrappedComponent);

        function forwardRef(props, ref) {
            return (
                <Injector
                    { ...props }
                    forwardRef={ ref }
                />
            )
        }

        forwardRef.displayName = `Injector-${ WrappedComponent.displayName || WrappedComponent.name || 'Component' }`;
        return React.forwardRef(forwardRef);
    };
}
