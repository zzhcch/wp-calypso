/**
 * External Dependencies
 */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';

/**
 * Internal Dependencies
 */
import { Greeting } from '../';
import Gravatar from 'components/gravatar';

function fakeTranslate( str ) {
	return str;
}

describe( 'Greeting', () => {
	it( 'should render nicely', () => {
		const wrapper = shallow( <Greeting translate={ fakeTranslate } /> );
		expect( wrapper.find( '.greeting__name' ) ).to.have.text( 'Howdy' );
		expect( wrapper.find( '.greeting__name-length' ) ).to.have.text( '' );
		expect( wrapper.find( Gravatar ) ).to.have.length( 1 );
	} );
} );
