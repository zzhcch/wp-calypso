/**
 * External Dependencies
 */
import React, { Component } from 'react';
import { localize } from 'i18n-calypso';

/**
 * Internal Dependencies
 */
import Gravatar from 'components/gravatar';

export class Greeting extends Component {
	constructor( props ) {
		super( props );
		this.state = {
			nameLength: props.name.length
		};
	}

	componentWillMount() {
		console.log( 'willmount', this );
	}

	componentDidMount() {
		console.log( 'didmount', this );
	}

	componentWillReceiveProps( nextProps ) {
		console.log( 'receiveProps', this, nextProps );
		this.setState( {
			nameLength: nextProps.name.length
		} );
	}

	componentDidUpdate( nextProps, nextState ) {
		console.log( 'didupdate', nextProps, nextState );
	}

	componentWillUnmount() {
		console.log( 'unmount', this );
	}

	render() {
		const { translate, name } = this.props;
		return (
			<div className="greeting">
				<Gravatar size={ 96 } user={ {} } />
				<span className="greeting__name">
				{
					name
					? translate( 'Hello %s', {
						args: [ name ]
					} )
					: translate( 'Howdy' )
				}
				</span>
				{ ' ' }
				<span className="greeting__name-length">
					{ this.state.nameLength }
				</span>
			</div>
		);
	}
}

export default localize( Greeting );
