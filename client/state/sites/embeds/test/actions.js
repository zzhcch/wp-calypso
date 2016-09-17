/**
 * External dependencies
 */
import { expect } from 'chai';
import nock from 'nock';

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

const embeds = [
	"#^https?://on.aol.(ca|com|co.uk)/video/([a-zA-z0-9-_]+)-([\d]+)#",
	"#https?://(www\.)?bandsintown.com/(\S+)#",
	"#http://money.cnn.com(/video([a-zA-Z0-9\.\/_\-]+).cnnmoney).*#",
	"#https?://(www\.)?dropbox\.com/s/([^/]+)/(.*)\.(jpg|jpeg|png|gif)#i",
	"#^https?://(www.)?facebook\.com/([^/]+)/(posts|photos)/([^/]+)?#",
	"#^https?://(www.)?facebook\.com/permalink.php\?([^\s]+)#"
];

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
					embeds
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
			fetchSiteEmbeds( siteId )( spy );

			expect( spy ).to.have.been.calledWith( {
				type: SITE_EMBEDS_FETCH,
				siteId
			} );
		} );

		it( 'should return a fetch complete action object', done => {
			const siteId = 2916284;

			fetchSiteEmbeds( siteId )( spy ).then( () => {
				expect( spy ).to.have.been.calledWith( {
					type: SITE_EMBEDS_FETCH_COMPLETE,
					embeds
				} );

				done();
			} ).catch( done );
		} );

		it( 'should return a fetch error action object', done => {
			const siteId = 77203074;
			fetchSiteEmbeds( siteId )( spy ).then( () => {
				expect( spy ).to.have.been.calledWith( {
					type: SITE_EMBEDS_FETCH_FAILED,
					siteId,
					error: sandbox.match( { message: 'An active access token must be used to access media-storage.' } )
				} );

				done();
			} ).catch( done );
		} );
	} );
} );
