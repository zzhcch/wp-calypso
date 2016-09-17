/**
 * External Dependencies
 */
import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';

/**
 * Internal Dependencies
 */
import { Greeting } from '../';
import Gravatar from 'components/gravatar';
import useFakeDom from 'test/helpers/use-fake-dom';

function fakeTranslate( str ) {
	return str;
}

describe( 'Greeting', () => {
	useFakeDom();

	it( 'should render empty nicely', () => {
		const wrapper = shallow( <Greeting translate={ fakeTranslate } /> );
		expect( wrapper.find( '.greeting__name' ) ).to.have.text( 'Howdy' );
		expect( wrapper.find( '.greeting__name-length' ) ).to.have.text( '' );
		expect( wrapper.find( Gravatar ) ).to.have.length( 1 );
	} );

	it( 'should render a name nicely', () => {
		let callingArgs;
		function fakeTranslateThatRememberArgs( str, options ) {
			callingArgs = options.args;
			return str;
		}
		const wrapper = mount(
			<Greeting
				translate={ fakeTranslateThatRememberArgs }
				name="ben"
			/> );
		expect( wrapper.find( '.greeting__name' ) ).to.have.text( 'Hello %s' );
		expect( callingArgs[ 0 ] ).to.equal( 'ben' );
		expect( wrapper.find( '.greeting__name-length' ) ).to.have.text( '3' );
		expect( wrapper.find( Gravatar ) ).to.have.length( 1 );
	} );
} );
