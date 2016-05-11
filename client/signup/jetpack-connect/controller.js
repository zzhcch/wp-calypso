/**
 * External Dependencies
 */
import ReactDom from 'react-dom';
import React from 'react';
import isEmpty from 'lodash/isEmpty';
import pick from 'lodash/pick';
import find from 'lodash/find';
import page from 'page';
import Debug from 'debug';

/**
 * Internal Dependencies
 */
import JetpackConnect from './index';
import jetpackConnectAuthorizeForm from './authorize-form';
import { setSection } from 'state/ui/actions';
import { renderWithReduxStore } from 'lib/react-helpers';
import { JETPACK_CONNECT_QUERY_SET, JETPACK_CONNECT_QUERY_UPDATE } from 'state/action-types';
import userFactory from 'lib/user';
import i18nUtils from 'lib/i18n-utils';

/**
 * Module variables
 */
const debug = new Debug( 'calypso:jetpack-connect:controller' );
const userModule = userFactory();

function getLocale( parameters ) {
	const paths = [ 'jetpack', 'connect', 'authorize', 'locale' ];
	return find( pick( parameters, paths ), isLocale );
}

function isLocale( pathFragment ) {
	return ! isEmpty( i18nUtils.getLanguage( pathFragment ) );
}

export default {
	saveQueryObject( context, next ) {
		if ( ! isEmpty( context.query ) && context.query.redirect_uri ) {
			debug( 'set initial query object', context.query );
			context.store.dispatch( { type: JETPACK_CONNECT_QUERY_SET, queryObject: context.query } );
			return page.redirect( context.pathname );
		}

		if ( ! isEmpty( context.query ) && context.query.update_nonce ) {
			debug( 'updating nonce', context.query );
			context.store.dispatch( { type: JETPACK_CONNECT_QUERY_UPDATE, property: '_wp_nonce', value: context.query.update_nonce } );
			return page.redirect( context.pathname );
		}

		next();
	},

	connect( context ) {
		ReactDom.unmountComponentAtNode( document.getElementById( 'secondary' ) );
		context.store.dispatch( setSection( 'jetpackConnect', {
			hasSidebar: false
		} ) );

		renderWithReduxStore(
			React.createElement( JetpackConnect, {
				path: context.path,
				context: context,
				locale: getLocale( context.params ),
				user: userModule.get()
			} ),
			document.getElementById( 'primary' ),
			context.store
		);
	},

	authorizeForm( context ) {
		ReactDom.unmountComponentAtNode( document.getElementById( 'secondary' ) );
		context.store.dispatch( setSection( 'jetpackConnect', {
			hasSidebar: false
		} ) );

		userModule.fetch();

		renderWithReduxStore(
			React.createElement( jetpackConnectAuthorizeForm, {
				path: context.path,
				locale: getLocale( context.params ),
				userModule: userModule
			} ),
			document.getElementById( 'primary' ),
			context.store
		);
	}
};
