/**
 * External dependencies
 */
import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import { localize } from 'i18n-calypso';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import support from 'lib/url/support';
import Card from 'components/card';
import Button from 'components/button';
import FormLabel from 'components/forms/form-label';
import FormInput from 'components/forms/form-text-input';

export class LostPassword extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			isSubmitting: false,
		};
	}

	onSubmit = () => {
		const userLogin = findDOMNode( this.refs.user_login ).value;

		if ( ! userLogin ) {
			return;
		}

		this.setState( { isSubmitting: true, userLogin } );

		//TODO: dispatch an event with userLogin and wait to here back
	};

	render() {
		const { translate, className } = this.props;
		const { isSubmitting } = this.state;
		const classes = classnames( 'lost-password__container', className );

		return (
			<div className={ classes }>
				<h2 className="lost-password__title">
					{ translate( 'Lost your password' ) }
				</h2>

				<p>{ translate( 'Follow theses simple steps to reset your account:' ) }</p>

				<ol className="lost-password__instruction-list">
					<li>
						{ translate(
							'Enter your {{strong}}WordPress.com{{/strong}} username or email address',
							{ components: { strong: <strong /> } }
						) }
					</li>
					<li>
						{ translate( 'Choose a password reset method' ) }
					</li>
					<li>
						{ translate(
							'Follow instructions and be re-united with your {{strong}}WordPress.com{{/strong}} account',
							{ components: { strong: <strong /> } }
						) }
					</li>
				</ol>

				<p>
					{ translate(
						'Want more help? We have a full {{link}}guid to resetting your password{{/link}}.',
						{ components: { link: <a href={ support.ACCOUNT_RECOVERY } /> } }
					) }
				</p>

				<Card>
					<FormLabel htmlFor="user_login">{ translate( 'Username or Email' ) }</FormLabel>

					<FormInput
						className="lost-password__user-login-input"
						ref="user_login"
						id="user_login"
						name="user_login"
						disabled={ isSubmitting } />

					<a href="/account-recovery/username" className="lost-password__forgot-username-link">
						{ translate( 'Forgot your username?' ) }
					</a>

					<Button
						className="lost-password__submit-button"
						onClick={ this.onSubmit }
						disabled={ isSubmitting }
						primary
					>
						{ translate( 'Get New Password' ) }
					</Button>
				</Card>

			</div>
		);
	}
}

export default localize( LostPassword );
