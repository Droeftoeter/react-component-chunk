import React, { Component } from 'react';
import PropTypes from 'prop-types';
import hoistStatics from 'hoist-non-react-statics';
import invariant from 'invariant';

export default function wrap({ reducers, sagas }) {
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
                }),
            };

            /**
             * Inject the reducers and sagas on mount
             */
            componentWillMount() {
                if (reducers && Object.keys(reducers).length > 0) {
                    invariant(
                        this.context.store && this.context.store.injectReducers,
                        'No store or no injectReducers function on store. Make sure the store is enhanced with the injectableReducers enhancer',
                    );

                    this.context.store.injectReducers(reducers);
                }
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
