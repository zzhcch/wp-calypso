/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import {
	SITE_EMBEDS_FETCH,
	SITE_EMBEDS_FETCH_COMPLETE,
	SITE_EMBEDS_FETCH_FAILED
} from 'state/action-types';
import { fetchSiteEmbeds } from '../actions';
import { useSandbox } from 'test/helpers/use-sinon';

describe( 'actions', () => {
	let sandbox, spy;

	useSandbox( newSandbox => {
		sandbox = newSandbox;
		spy = sandbox.spy();
	} );

	describe( '#fetchSiteEmbeds()', () => {
		before( () => {
			nock( 'https://public-api.wordpress.com:443' )
				.persist()
				.get( '/rest/v1.1/sites/2916284/embeds' )
				.reply( 200, {
					embeds: []
				} )
				.get( '/rest/v1.1/sites/77203074/embeds' )
				.reply( 403, {
					error: 'authorization_required',
					message: 'An active access token must be used to access media-storage.'
				} );
		} );

		after( () => {
			nock.cleanAll();
		} );

		it( 'should return an action object with site Id', () => {
			const siteId = 2916284;
			const action = fetchSiteEmbeds( siteId )( spy );

			expect( spy ).to.have.been.calledWith( {
				type: SITE_EMBEDS_FETCH,
				siteId
			} );
		} );

		it( 'should return a list em embeds for the provided site id', () => {
			const siteId = 2916284;
			const actions = fetchSiteEmbeds( siteId )( spy ).then( () => {

			} );
		} );
	} );
} );
