/**
 * External dependencies
 */
import nock from 'nock';
import sinon from 'sinon';
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import {
	SHARING_BUTTONS_LIST_FETCH,
	SHARING_BUTTONS_LIST_FETCH_FAILURE,
	SHARING_BUTTONS_LIST_FETCH_SUCCESS
} from 'state/action-types';
import {
	fetchSharingButtons,
	receiveSharingButtons,
	failSharingButtonsRequest
} from '../actions';

describe( '#fetchSharingButtons()', () => {
	const spy = sinon.spy(),
		response = {
			update: [
				{
					"ID": "facebook",
					"name": "Facebook",
					"shortname": "facebook",
					"custom": false,
					"enabled": true,
					"visibility": "visible",
					"genericon": "\\f203"
				}, {
					"ID": "linkedin",
					"name": "LinkedIn",
					"shortname": "linkedin",
					"custom": false,
					"enabled": false,
					"genericon": "\\f207"
				}
			]
		};

	before( () => {
		nock( 'https://public-api.wordpress.com:443' )
			.persist()
			.get( '/rest/v1.1/sites/2916284/sharing-buttons' )
			.reply( 200, response )
			.get( '/rest/v1.1/sites/77203074/sharing-buttons' )
			.reply( 403, {
				error: 'authorization_required',
				message: 'An active access token must be used to access publicize connections.'
			} );
	} );

	beforeEach( () => {
		spy.reset();
	} );

	after( () => {
		nock.cleanAll();
	} );

	it( 'should dispatch fetch action when thunk triggered', () => {
		fetchSharingButtons( 2916284 )( spy );

		expect( spy ).to.have.been.calledWith( {
			type: SHARING_BUTTONS_LIST_FETCH,
			siteId: 2916284
		} );
	} );

	it( 'should dispatch receive action when request completes', ( done ) => {
		fetchSharingButtons( 2916284 )( spy ).then( () => {
			expect( spy ).to.have.been.calledTwice;

			const action = spy.getCall( 1 ).args[ 0 ];
			expect( action.type ).to.equal( SHARING_BUTTONS_LIST_FETCH_SUCCESS );
			expect( action.siteId ).to.equal( 2916284 );
			expect( action.data ).to.eql( response );

			done();
		} ).catch( done );
	} );

	it( 'should dispatch fail action when request fails', ( done ) => {
		fetchSharingButtons( 77203074 )( spy ).then( () => {
			expect( spy ).to.have.been.calledTwice;

			const action = spy.getCall( 1 ).args[ 0 ];
			expect( action.type ).to.equal( SHARING_BUTTONS_LIST_FETCH_FAILURE );
			expect( action.siteId ).to.equal( 77203074 );
			expect( action.error.message ).to.equal( 'An active access token must be used to access publicize connections.' );

			done();
		} ).catch( done );
	} );
} );

describe( '#receiveSharingButtons()', () => {
	it( 'should return an action object', () => {
		const data = { connections: [ { ID: 2, site_ID: 2916284 } ] };
		const action = receiveSharingButtons( 2916284, data );

		expect( action ).to.eql( {
			type: SHARING_BUTTONS_LIST_FETCH_SUCCESS,
			siteId: 2916284,
			data
		} );
	} );
} );

describe( '#failSharingButtonsRequest()', () => {
	it( 'should return an action object', () => {
		const error = new Error();
		const action = failSharingButtonsRequest( 2916284, error );

		expect( action ).to.eql( {
			type: SHARING_BUTTONS_LIST_FETCH_FAILURE,
			siteId: 2916284,
			error
		} );
	} );
} );
